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

        /**
         * This here is for preventing race conditions when multiple requests are made to the backend
         */
        requestId: 0,

    }),

    actions: {

        /**
         * This is the main search function, that delivers all the tests to the /tests page.
         */
        async getAll(): Promise<void> {

            /**
             * When we want to searc for'...abc...', 'a' will be request 1. 'ab' will be request 2.
             * 'abc' will be request 3. Now, it may happen, that request 1 arrives last for some reason,
             * after request 3. This is the race condition.
             */
            const requestId = ++this.requestId;
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

                /**
                 * Only update the store if this is still the latest request. Meaning... If request
                 * 1 arrives after request 3, below we will have 1 !== 3, and we will not update the
                 * store. Aka, we will not have the final search term to be 'a'. It will be still 'abc'.
                 */
                if (requestId === this.requestId) {
                    this.tests = response.data;
                    this.pagination = response.meta;
                    this.paginationLinks = response.links;
                }
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Used for http://localhost:5174/analytics/5 type requests.
         */
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
