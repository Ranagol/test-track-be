import appAxios from './axiosService'
import type { Test, PaginatedResponse, CreateTestPayload } from '@/types/types'
import type { QueryParams } from '@/types/types'

const testService = {

    async getAll(params?: QueryParams): Promise<PaginatedResponse<Test>> {
        const response = await appAxios.get<PaginatedResponse<Test>>('/api/tests', { params })
        return response.data
    },

    /**
     * Used for http://localhost:5174/analytics/5 type requests.
     * Laravel Resource tends to wrap everything with a {data: ...} object,
     */
    async getAnalytics(testTakerId: number): Promise<Test[]> {
        const response = await appAxios.get<{ data: Test[] }>(`/api/analytics?testTakerId=${testTakerId}`)
        return response.data.data
    },

    async get(id: number): Promise<Test> {
        const response = await appAxios.get<{ data: Test }>(`/api/tests/${id}`)
        return response.data.data
    },

    async getByCode(testCode: string): Promise<Test> {
        const response = await appAxios.get<{ data: Test }>(`/api/tests/test-code/${testCode}`)
        return response.data.data
    },

    async create(data: CreateTestPayload): Promise<Test> {
        const response = await appAxios.post<{ data: Test }>('/api/tests', data)
        return response.data.data
    },

    async update(test: Partial<Test>): Promise<Test> {
        const response = await appAxios.put<{ data: Test }>(`/api/tests/${test.id}`, test)
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await appAxios.delete(`/api/tests/${id}`)
    }
}

export default testService;
