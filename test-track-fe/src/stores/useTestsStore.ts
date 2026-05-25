import { defineStore } from 'pinia';
import type { Test, PaginationMeta, PaginationLinks } from '@/types/types';
import testService from '@/services/testService';
import type { TestQueryParams } from '@/types/types';

export const useTestsStore = defineStore('tests', {

    state: () => ({
        tests: [] as Test[],
        loading: false as boolean,

        searchTerm: '' as string,
        sortBy: 'created_at' as string,
        sortOrder: 'desc' as 'asc' | 'desc',

        // Pagination data from the backend
        pagination: null as null | PaginationMeta,
        paginationLinks: null as null | PaginationLinks,

        // Pagination data from el-pagination
        currentPage: 1 as number,
        pageSize: 10 as number,

    }),

    actions: {

        async getAll(): Promise<void> {
            this.loading = true;
            try {
                const response = await testService.getAll(
                    {
                        search: this.searchTerm,
                        sort_by: this.sortBy,
                        sort_order: this.sortOrder,
                        page: this.currentPage,
                        per_page: this.pageSize
                    } as TestQueryParams
                );
                this.tests = response.data;
                this.pagination = response.meta;
                this.paginationLinks = response.links;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getAnalytics(testTakerId: number): Promise<void> {
            this.loading = true;
            try {
                this.tests = await testService.getAnalytics(testTakerId);
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async delete(id: number): Promise<void> {
            this.loading = true;
            try {
                // Send delete request to the backend
                await testService.delete(id);

                // Remove the deleted test from the store, filter here means: return all, except the deleted test
                this.tests = this.tests.filter(test => test.id !== id);

            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },
    }
});
