import appAxios from './axiosService'
import type { PaginatedResponse, QueryParams, TestTaker } from '@/types/types';

const testTakerService = {

    async getAll(params?: QueryParams): Promise<PaginatedResponse<TestTaker>> {
        const response = await appAxios.get<PaginatedResponse<TestTaker>>('/api/test-takers', { params });
        return response.data
    },
}

export default testTakerService;
