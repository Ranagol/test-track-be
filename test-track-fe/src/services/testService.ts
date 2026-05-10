import appAxios from './axiosService'
import type { Test, PaginatedResponse } from '@/types/types'
import type { TestQueryParams } from '@/types/types'


const testService = {

    async getAll(params?: TestQueryParams): Promise<PaginatedResponse<Test>> {
        const response = await appAxios.get<PaginatedResponse<Test>>('/api/tests', { params })
        return response.data
    },

    async get(id: number): Promise<Test> {
        const response = await appAxios.get<Test>(`/api/tests/${id}`)
        return response.data
    },

    // Partial<Test> means that all fields of Test are optional,
    async create(data: Partial<Test>): Promise<Test> {
        const response = await appAxios.post<Test>('/api/tests', data)
        return response.data
    },

    async update(id: number, data: Partial<Test>): Promise<Test> {
        const response = await appAxios.put<Test>(`/api/tests/${id}`, data)
        return response.data
    },

    async delete(id: number): Promise<void> {
        await appAxios.delete(`/api/tests/${id}`)
    }
}

export default testService
