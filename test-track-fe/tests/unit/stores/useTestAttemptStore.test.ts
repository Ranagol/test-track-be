import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTestAttemptStore } from '@/stores/useTestAttemptStore'
import testAttemptService from '@/services/testAttemptService'
import type { PaginatedResponse, TestAttempt } from '@/types/types'

vi.mock('@/services/testAttemptService', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
}))

const makeTestAttempt = (id: number): TestAttempt => ({
  id,
  user_id: 4,
  test_id: 8,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
})

const makeResponse = (testAttempt: TestAttempt, total = 1): PaginatedResponse<TestAttempt> => ({
  data: [testAttempt],
  links: {
    first: '/api/test-attempts?page=1',
    last: `/api/test-attempts?page=${total}`,
    prev: null,
    next: null,
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: total,
    per_page: 10,
    to: 1,
    total,
    path: '/api/test-attempts',
  },
})

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

describe('useTestAttemptStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('requests with current filters and stores the paginated response', async () => {
    const response = makeResponse(makeTestAttempt(1))
    vi.mocked(testAttemptService.getAll).mockResolvedValue(response)
    const store = useTestAttemptStore()
    store.searchTerm = 'algebra'
    store.sortBy = 'score_percentage'
    store.sortOrder = 'asc'
    store.currentPage = 3
    store.pageSize = 20

    await store.getAll()

    expect(testAttemptService.getAll).toHaveBeenCalledWith({
      searchTerm: 'algebra',
      sort_by: 'score_percentage',
      sort_order: 'asc',
      page: 3,
      per_page: 20,
    })
    expect(store.testAttempts).toEqual(response.data)
    expect(store.pagination).toEqual(response.meta)
    expect(store.paginationLinks).toEqual(response.links)
    expect(store.loading).toBe(false)
  })

  it('propagates request failures and preserves existing attempts', async () => {
    const error = new Error('Unable to load attempts')
    vi.mocked(testAttemptService.getAll).mockRejectedValue(error)
    const store = useTestAttemptStore()
    const existingAttempt = makeTestAttempt(1)
    store.testAttempts = [existingAttempt]

    await expect(store.getAll()).rejects.toBe(error)

    expect(store.testAttempts).toEqual([existingAttempt])
    expect(store.loading).toBe(false)
  })

  it('does not let an older response overwrite the latest attempts', async () => {
    const olderRequest = deferred<PaginatedResponse<TestAttempt>>()
    const latestRequest = deferred<PaginatedResponse<TestAttempt>>()
    vi.mocked(testAttemptService.getAll)
      .mockReturnValueOnce(olderRequest.promise)
      .mockReturnValueOnce(latestRequest.promise)
    const store = useTestAttemptStore()

    const loadOlderAttempts = store.getAll()
    store.searchTerm = 'latest'
    const loadLatestAttempts = store.getAll()

    latestRequest.resolve(makeResponse(makeTestAttempt(2)))
    await loadLatestAttempts
    olderRequest.resolve(makeResponse(makeTestAttempt(1)))
    await loadOlderAttempts

    expect(store.testAttempts).toEqual([makeTestAttempt(2)])
    expect(store.pagination?.total).toBe(1)
  })

  it('keeps loading while the latest request is pending after an older request settles', async () => {
    const olderRequest = deferred<PaginatedResponse<TestAttempt>>()
    const latestRequest = deferred<PaginatedResponse<TestAttempt>>()
    vi.mocked(testAttemptService.getAll)
      .mockReturnValueOnce(olderRequest.promise)
      .mockReturnValueOnce(latestRequest.promise)
    const store = useTestAttemptStore()

    const loadOlderAttempts = store.getAll()
    store.searchTerm = 'latest'
    const loadLatestAttempts = store.getAll()

    olderRequest.resolve(makeResponse(makeTestAttempt(1)))
    await loadOlderAttempts

    expect(store.testAttempts).toEqual([])
    expect(store.loading).toBe(true)

    latestRequest.resolve(makeResponse(makeTestAttempt(2)))
    await loadLatestAttempts

    expect(store.testAttempts).toEqual([makeTestAttempt(2)])
    expect(store.loading).toBe(false)
  })

  it('records answers for multiple questions', () => {
    const store = useTestAttemptStore()

    store.updateUserAnswers(12, 31)
    store.updateUserAnswers(13, 34)

    expect(store.userAnswers).toEqual([
      { question_id: 12, answer_option_id: 31 },
      { question_id: 13, answer_option_id: 34 },
    ])
  })

  it('replaces an answer for the same question without adding a duplicate', () => {
    const store = useTestAttemptStore()
    store.updateUserAnswers(12, 31)
    store.updateUserAnswers(13, 34)

    store.updateUserAnswers(12, 32)

    expect(store.userAnswers).toEqual([
      { question_id: 12, answer_option_id: 32 },
      { question_id: 13, answer_option_id: 34 },
    ])
  })

  it('clears attempt data and can be called when already empty', () => {
    const store = useTestAttemptStore()
    store.testAttempt = { test_id: 7 }
    store.updateUserAnswers(12, 31)

    store.resetTestAttempt()

    expect(store.testAttempt).toEqual({})
    expect(store.userAnswers).toEqual([])

    expect(() => store.resetTestAttempt()).not.toThrow()
    expect(store.testAttempt).toEqual({})
    expect(store.userAnswers).toEqual([])
  })
})