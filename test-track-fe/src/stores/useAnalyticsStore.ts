import { defineStore } from 'pinia';
import type { Test, BackendError, PaginationMeta, PaginationLinks } from '@/types/types';
import type { TestQueryParams } from '@/types/types';
import analyticsService from '@/services/analyticsService';

export const useAnalyticsStore = defineStore('analytics', {

    state: () => ({
        analytics: [] as Test[],
        loading: false as boolean,

        searchTerm: '' as string,
        sortBy: 'title' as string,
        sortOrder: 'asc' as 'asc' | 'desc',

        // Pagination data from the backend
        pagination: null as null | PaginationMeta,
        paginationLinks: null as null | PaginationLinks,

        // Pagination data from el-pagination
        currentPage: 1 as number,
        pageSize: 2 as number,
    }),

    actions: {

        async getAll(): Promise<void> {
            this.loading = true;
            try {
                const response = await analyticsService.getAll(
                    {
                        search: this.searchTerm,
                        sort_by: this.sortBy,
                        sort_order: this.sortOrder,
                        page: this.currentPage,
                        per_page: this.pageSize
                    } as TestQueryParams
                );
                this.analytics = response.data;
                this.pagination = response.meta;
                this.paginationLinks = response.links;
            } finally {
                this.loading = false;
            }
        },
    },
});
