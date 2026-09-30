import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTestsStore } from '@/stores/useTestsStore'
import testService from '@/services/testService'
import type { PaginatedResponse, Test } from '@/types/types'

vi.mock('@/services/testService', () => ({
  default: {
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}))

const makeTest = (id: number, title: string): Test => ({ id, title })

const makeResponse = (test: Test, total = 1): PaginatedResponse<Test> => ({
  data: [test],
  links: {
    first: '/api/tests?page=1',
    last: `/api/tests?page=${total}`,
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
    path: '/api/tests',
  },
})

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

describe('useTestsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('requests with current filters and stores the paginated response', async () => {
    const response = makeResponse(makeTest(1, 'Algebra'))
    vi.mocked(testService.getAll).mockResolvedValue(response)
    const store = useTestsStore()
    store.searchTerm = 'algebra'
    store.sortBy = 'title'
    store.sortOrder = 'asc'
    store.currentPage = 2
    store.pageSize = 25

    await store.getAll()

    expect(testService.getAll).toHaveBeenCalledWith({
      search: 'algebra',
      sort_by: 'title',
      sort_order: 'asc',
      page: 2,
      per_page: 25,
    })
    expect(store.tests).toEqual(response.data)
    expect(store.pagination).toEqual(response.meta)
    expect(store.paginationLinks).toEqual(response.links)
    expect(store.loading).toBe(false)
  })

  it('propagates request failures and preserves the existing list', async () => {
    const error = new Error('Unable to load tests')
    vi.mocked(testService.getAll).mockRejectedValue(error)
    const store = useTestsStore()
    const existingTest = makeTest(1, 'Existing test')
    store.tests = [existingTest]

    await expect(store.getAll()).rejects.toBe(error)

    expect(store.tests).toEqual([existingTest])
    expect(store.loading).toBe(false)
  })

  it('does not let an older response overwrite the latest results', async () => {
    const olderRequest = deferred<PaginatedResponse<Test>>()
    const latestRequest = deferred<PaginatedResponse<Test>>()
    vi.mocked(testService.getAll)
      .mockReturnValueOnce(olderRequest.promise)
      .mockReturnValueOnce(latestRequest.promise)
    const store = useTestsStore()

    const loadOlderResults = store.getAll()
    store.searchTerm = 'latest'
    const loadLatestResults = store.getAll()

    latestRequest.resolve(makeResponse(makeTest(2, 'Latest result')))
    await loadLatestResults
    olderRequest.resolve(makeResponse(makeTest(1, 'Stale result')))
    await loadOlderResults

    expect(store.tests).toEqual([makeTest(2, 'Latest result')])
    expect(store.pagination?.total).toBe(1)
  })

  it('keeps loading while the latest request is pending after an older request settles', async () => {
    const olderRequest = deferred<PaginatedResponse<Test>>()
    const latestRequest = deferred<PaginatedResponse<Test>>()
    vi.mocked(testService.getAll)
      .mockReturnValueOnce(olderRequest.promise)
      .mockReturnValueOnce(latestRequest.promise)
    const store = useTestsStore()

    const loadOlderResults = store.getAll()
    store.searchTerm = 'latest'
    const loadLatestResults = store.getAll()

    olderRequest.resolve(makeResponse(makeTest(1, 'Stale result')))
    await loadOlderResults

    expect(store.tests).toEqual([])
    expect(store.loading).toBe(true)

    latestRequest.resolve(makeResponse(makeTest(2, 'Latest result')))
    await loadLatestResults

    expect(store.tests).toEqual([makeTest(2, 'Latest result')])
    expect(store.loading).toBe(false)
  })
})
