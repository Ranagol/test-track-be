import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import * as authService from '@/services/authService'
import type { LoginPayload, RegisterPayload, User } from '@/types/types'

vi.mock('@/services/authService', () => ({
  fetchCurrentUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
}))

const user: User = {
  id: 7,
  name: 'Test User',
  email: 'test@example.com',
}

const loginPayload: LoginPayload = {
  email: user.email,
  password: 'password',
}

const registerPayload: RegisterPayload = {
  name: user.name,
  email: user.email,
  password: 'password',
  password_confirmation: 'password',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('hydrates the current user only once', async () => {
    vi.mocked(authService.fetchCurrentUser).mockResolvedValue(user)
    const store = useAuthStore()

    await store.getCurrentUser()
    await store.getCurrentUser()

    expect(authService.fetchCurrentUser).toHaveBeenCalledTimes(1)
    expect(store.user).toEqual(user)
    expect(store.userId).toBe(user.id)
    expect(store.isAuthenticated).toBe(true)
    expect(store.initialized).toBe(true)
    expect(store.loading).toBe(false)
  })

  it('clears stale auth and finishes initialization when hydration fails', async () => {
    const error = new Error('Unable to fetch user')
    vi.mocked(authService.fetchCurrentUser).mockRejectedValue(error)
    const store = useAuthStore()
    store.user = user

    await expect(store.getCurrentUser()).rejects.toBe(error)

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.initialized).toBe(true)
    expect(store.loading).toBe(false)
  })

  it('signs in and loads the authenticated user', async () => {
    vi.mocked(authService.login).mockResolvedValue()
    vi.mocked(authService.fetchCurrentUser).mockResolvedValue(user)
    const store = useAuthStore()

    await store.signIn(loginPayload)

    expect(authService.login).toHaveBeenCalledWith(loginPayload)
    expect(authService.fetchCurrentUser).toHaveBeenCalledOnce()
    expect(
      vi.mocked(authService.login).mock.invocationCallOrder[0],
    ).toBeLessThan(vi.mocked(authService.fetchCurrentUser).mock.invocationCallOrder[0])
    expect(store.user).toEqual(user)
    expect(store.loading).toBe(false)
  })

  it('clears stale auth and resets loading when sign-in fails', async () => {
    const error = new Error('Invalid credentials')
    vi.mocked(authService.login).mockRejectedValue(error)
    const store = useAuthStore()
    store.user = user

    await expect(store.signIn(loginPayload)).rejects.toBe(error)

    expect(authService.fetchCurrentUser).not.toHaveBeenCalled()
    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
  })

  it('loads the authenticated user after registration', async () => {
    vi.mocked(authService.register).mockResolvedValue()
    vi.mocked(authService.fetchCurrentUser).mockResolvedValue(user)
    const store = useAuthStore()

    await store.register(registerPayload)

    expect(authService.register).toHaveBeenCalledWith(registerPayload)
    expect(authService.fetchCurrentUser).toHaveBeenCalledOnce()
    expect(store.user).toEqual(user)
    expect(store.loading).toBe(false)
  })

  it('clears auth after a successful sign-out', async () => {
    vi.mocked(authService.logout).mockResolvedValue()
    const store = useAuthStore()
    store.user = user

    await store.signOut()

    expect(authService.logout).toHaveBeenCalledOnce()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.loading).toBe(false)
  })

  it('preserves auth and resets loading when sign-out fails', async () => {
    const error = new Error('Unable to sign out')
    vi.mocked(authService.logout).mockRejectedValue(error)
    const store = useAuthStore()
    store.user = user

    await expect(store.signOut()).rejects.toBe(error)

    expect(store.user).toEqual(user)
    expect(store.isAuthenticated).toBe(true)
    expect(store.loading).toBe(false)
  })

  it('clears auth immediately without changing initialization state', () => {
    const store = useAuthStore()
    store.user = user
    store.initialized = true

    store.clearAuth()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.initialized).toBe(true)
  })
})
