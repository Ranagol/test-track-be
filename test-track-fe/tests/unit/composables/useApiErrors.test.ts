import axios, { AxiosError, type AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import router from '@/router/router'
import { useApiErrors } from '@/composables/useApiErrors'

vi.mock('@/router/router', () => ({
  default: { push: vi.fn() },
}))

const createAxiosError = (status?: number, data?: unknown): AxiosError => {
  const error = new AxiosError('Request failed')

  if (status !== undefined) {
    error.response = { status, data } as AxiosResponse
  }

  return error
}

describe('useApiErrors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stores field validation errors and clears previous general errors', () => {
    const { validationErrors, generalError, handleBackendErrors } = useApiErrors()
    const fieldErrors = { title: ['The title is required.'] }
    validationErrors.value = { description: ['Old error'] }
    generalError.value = 'Old general error'

    handleBackendErrors(createAxiosError(422, {
      message: 'Validation failed',
      errors: fieldErrors,
    }))

    expect(validationErrors.value).toEqual(fieldErrors)
    expect(generalError.value).toBe('')
    expect(router.push).not.toHaveBeenCalled()
  })

  it('uses a backend message for a 422 response without field errors', () => {
    const { validationErrors, generalError, handleBackendErrors } = useApiErrors()
    validationErrors.value = { email: ['Old error'] }

    handleBackendErrors(createAxiosError(422, {
      message: 'These credentials do not match our records.',
      errors: {},
    }))

    expect(validationErrors.value).toEqual({})
    expect(generalError.value).toBe('These credentials do not match our records.')
  })

  it('uses a fallback for a 422 response without errors or a message', () => {
    const { generalError, handleBackendErrors } = useApiErrors()

    handleBackendErrors(createAxiosError(422, { errors: {} }))

    expect(generalError.value).toBe('An unexpected error occurred. Please try again later.')
  })

  it.each([401, 419])('redirects to session-expired for status %i', (status) => {
    const { validationErrors, generalError, handleBackendErrors } = useApiErrors()
    validationErrors.value = { email: ['Old error'] }

    handleBackendErrors(createAxiosError(status))

    expect(validationErrors.value).toEqual({})
    expect(generalError.value).toBe('Your session has expired. Please log in again.')
    expect(router.push).toHaveBeenCalledWith({ name: 'session-expired' })
    expect(router.push).toHaveBeenCalledOnce()
  })

  it('reports network failures and has no status code when the server did not respond', () => {
    const { generalError, handleBackendErrors, getStatusCode } = useApiErrors()

    handleBackendErrors(new AxiosError('Network Error'))

    expect(generalError.value).toBe('Unable to connect to the server.')
    expect(getStatusCode(new AxiosError('Network Error'))).toBeNull()
    expect(router.push).not.toHaveBeenCalled()
  })

  it('uses a fallback for non-Axios errors', () => {
    const { generalError, handleBackendErrors, getStatusCode } = useApiErrors()

    handleBackendErrors(new Error('Unexpected client error'))

    expect(generalError.value).toBe('An unexpected error occurred. Please try again later.')
    expect(getStatusCode(new Error('Unexpected client error'))).toBeNull()
  })

  it('uses a fallback and exposes the status for unexpected backend responses', () => {
    const error = createAxiosError(500, { message: 'Internal server error' })
    const { generalError, handleBackendErrors, getStatusCode } = useApiErrors()

    handleBackendErrors(error)

    expect(generalError.value).toBe('An unexpected error occurred. Please try again later.')
    expect(getStatusCode(error)).toBe(500)
    expect(router.push).not.toHaveBeenCalled()
  })
})
