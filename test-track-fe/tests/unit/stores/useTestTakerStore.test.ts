import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTestTakerStore } from '@/stores/useTestTakerStore'
import testTakerService from '@/services/testTakerService'
import type { PaginatedResponse, Test, TestTaker } from '@/types/types'

vi.mock('@/services/testTakerService', () => ({
  default: {
    getAll: vi.fn(),
    get: vi.fn(),
    getPerformance: vi.fn(),
  },
}))

const makeTestTaker = (id: number): TestTaker => ({
  id,
  name: `Test taker ${id}`,
  email: `taker${id}@example.com`,
  tests: 2,
  test_attempts: 3,
})

const makeTest = (id: number): Test => ({
  id,
  title: `Test ${id}`,
})

const makeResponse = (testTaker: TestTaker, total = 1): PaginatedResponse<TestTaker> => ({
  data: [testTaker],
  links: {
    first: '/api/test-takers?page=1',
    last: `/api/test-takers?page=${total}`,
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
    path: '/api/test-takers',
  },
})

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

describe('useTestTakerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('loads test takers with current filters and pagination', async () => {
    const response = makeResponse(makeTestTaker(1))
    vi.mocked(testTakerService.getAll).mockResolvedValue(response)
    const store = useTestTakerStore()
    store.searchTerm = 'taker'
    store.sortBy = 'test_attempts'
    store.sortOrder = 'desc'
    store.currentPage = 2
    store.pageSize = 25

    await store.getAll()

    expect(testTakerService.getAll).toHaveBeenCalledWith({
      search: 'taker',
      sort_by: 'test_attempts',
      sort_order: 'desc',
      page: 2,
      per_page: 25,
    })
    expect(store.testTakers).toEqual(response.data)
    expect(store.pagination).toEqual(response.meta)
    expect(store.paginationLinks).toEqual(response.links)
    expect(store.loading).toBe(false)
  })

  it('propagates list failures and preserves existing test takers', async () => {
    const error = new Error('Unable to load test takers')
    vi.mocked(testTakerService.getAll).mockRejectedValue(error)
    const store = useTestTakerStore()
    const existingTaker = makeTestTaker(1)
    store.testTakers = [existingTaker]

    await expect(store.getAll()).rejects.toBe(error)

    expect(store.testTakers).toEqual([existingTaker])
    expect(store.loading).toBe(false)
  })

  it('does not let an older list response overwrite the latest results', async () => {
    const olderRequest = deferred<PaginatedResponse<TestTaker>>()
    const latestRequest = deferred<PaginatedResponse<TestTaker>>()
    vi.mocked(testTakerService.getAll)
      .mockReturnValueOnce(olderRequest.promise)
      .mockReturnValueOnce(latestRequest.promise)
    const store = useTestTakerStore()

    const loadOlderResults = store.getAll()
    store.searchTerm = 'latest'
    const loadLatestResults = store.getAll()

    latestRequest.resolve(makeResponse(makeTestTaker(2)))
    await loadLatestResults
    olderRequest.resolve(makeResponse(makeTestTaker(1)))
    await loadOlderResults

    expect(store.testTakers).toEqual([makeTestTaker(2)])
    expect(store.pagination?.total).toBe(1)
  })

  it('keeps loading while the latest list request is pending after an older one settles', async () => {
    const olderRequest = deferred<PaginatedResponse<TestTaker>>()
    const latestRequest = deferred<PaginatedResponse<TestTaker>>()
    vi.mocked(testTakerService.getAll)
      .mockReturnValueOnce(olderRequest.promise)
      .mockReturnValueOnce(latestRequest.promise)
    const store = useTestTakerStore()

    const loadOlderResults = store.getAll()
    store.searchTerm = 'latest'
    const loadLatestResults = store.getAll()

    olderRequest.resolve(makeResponse(makeTestTaker(1)))
    await loadOlderResults

    expect(store.testTakers).toEqual([])
    expect(store.loading).toBe(true)

    latestRequest.resolve(makeResponse(makeTestTaker(2)))
    await loadLatestResults

    expect(store.testTakers).toEqual([makeTestTaker(2)])
    expect(store.loading).toBe(false)
  })

  it('loads one test taker', async () => {
    const testTaker = makeTestTaker(4)
    vi.mocked(testTakerService.get).mockResolvedValue(testTaker)
    const store = useTestTakerStore()

    await store.get(4)

    expect(testTakerService.get).toHaveBeenCalledWith(4)
    expect(store.testTaker).toEqual(testTaker)
    expect(store.loading).toBe(false)
  })

  it('propagates detail failures and preserves the current test taker', async () => {
    const error = new Error('Unable to load test taker')
    vi.mocked(testTakerService.get).mockRejectedValue(error)
    const store = useTestTakerStore()
    const existingTaker = makeTestTaker(1)
    store.testTaker = existingTaker

    await expect(store.get(4)).rejects.toBe(error)

    expect(store.testTaker).toEqual(existingTaker)
    expect(store.loading).toBe(false)
  })

  it('loads performance data for a test taker', async () => {
    const performance = [makeTest(3), makeTest(7)]
    vi.mocked(testTakerService.getPerformance).mockResolvedValue(performance)
    const store = useTestTakerStore()

    await store.getPerformance(4)

    expect(testTakerService.getPerformance).toHaveBeenCalledWith(4)
    expect(store.testTakerPerformance).toEqual(performance)
    expect(store.loading).toBe(false)
  })

  it('propagates performance failures and preserves existing results', async () => {
    const error = new Error('Unable to load performance')
    vi.mocked(testTakerService.getPerformance).mockRejectedValue(error)
    const store = useTestTakerStore()
    const existingPerformance = [makeTest(3)]
    store.testTakerPerformance = existingPerformance

    await expect(store.getPerformance(4)).rejects.toBe(error)

    expect(store.testTakerPerformance).toEqual(existingPerformance)
    expect(store.loading).toBe(false)
  })
})
