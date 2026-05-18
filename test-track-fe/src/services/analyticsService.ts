import appAxios from "./axiosService";
import type { TestQueryParams } from "@/types/types";
import type { Test, PaginatedResponse } from "@/types/types";

const analyticsService = {

    async getAll(params?: TestQueryParams): Promise<PaginatedResponse<Test>> {
        const response = await appAxios.get<PaginatedResponse<Test>>('/api/analytics', { params });
        return response.data;
    },
}

export default analyticsService;
