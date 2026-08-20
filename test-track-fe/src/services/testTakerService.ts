import appAxios from './axiosService'
import type { PaginatedResponse, QueryParams, TestTaker, Test } from '@/types/types';

const testTakerService = {

    /**
     * Gets all test takers from BE.
     */
    async getAll(params?: QueryParams): Promise<PaginatedResponse<TestTaker>> {
        const response = await appAxios.get<PaginatedResponse<TestTaker>>('/api/test-takers', { params });
        return response.data
    },

    /**
     * Used for http://localhost:5174/analytics/5 type requests.
     * Returns all tests, questions, answers, attempts for the given test taker
     * Laravel Resource tends to wrap everything with a {data: ...} object,
     */
    async getPerformance(testTakerId: number): Promise<Test[]> {
        const response = await appAxios.get<{ data: Test[] }>(`/api/test-takers/${testTakerId}/performance`);
        return response.data.data
    },

    /**
     * Gets the test taker from BE.
     */
    async get(id: number): Promise<TestTaker> {
        const response = await appAxios.get<{ data: TestTaker }>(`/api/test-takers/${id}`)
        return response.data.data
    },
}

export default testTakerService;
