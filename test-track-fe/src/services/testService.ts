import appAxios from './axiosService'
import type { Test, PaginatedResponse } from '@/types/types'
import type { TestQueryParams } from '@/types/types'

type CreateTestPayload = {
    user_id?: number;
    title?: string;
    description?: string;
    questions?: Array<{
        text: string;
        answer_options?: Array<{
            text: string;
            is_correct?: boolean;
        }>;
    }>;
}


const testService = {

    async getAll(params?: TestQueryParams): Promise<PaginatedResponse<Test>> {
        const response = await appAxios.get<PaginatedResponse<Test>>('/api/tests', { params })
        return response.data
    },

    // Laravel Resource tends to wrap everything with a {data: ...} object,
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
