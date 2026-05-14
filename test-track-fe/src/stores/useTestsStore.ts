import { defineStore } from 'pinia';
import type { Test, BackendError, PaginationMeta, PaginationLinks } from '@/types/types';
import testService from '@/services/testService';
import type { TestQueryParams } from '@/types/types';

export const useTestsStore = defineStore('tests', {

    state: () => ({
        tests: [] as Test[],
        test: null as null | Test,
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
            } finally {
                this.loading = false;
            }
        },

        async get(id: number): Promise<Test> {
            this.loading = true;
            try {
                const test = await testService.get(id);
                this.test = test;
                return test;
            } finally {
                this.loading = false;
            }
        },

        async getByCode(testCode: string): Promise<Test> {
            this.loading = true;
            try {
                const test = await testService.getByCode(testCode);
                this.test = test;
                return test;
            } finally {
                this.loading = false;
            }
        },

        async create(data: Test): Promise<Test> {
            this.loading = true;
            try {
                const test = await testService.create(data);
                this.tests.push(test);
                return test;
            } finally {
                this.loading = false;
            }
        },

        async update(id: number, data: Partial<Test>): Promise<Test> {
            this.loading = true;
            try {
                const test = await testService.update(id, data);
                const index = this.tests.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.tests[index] = test;
                }
                if (this.test && this.test.id === id) {
                    this.test = test;
                }
                return test;
            } finally {
                this.loading = false;
            }
        },

        async delete(id: number): Promise<void> {
            this.loading = true;
            try {
                await testService.delete(id);
                this.tests = this.tests.filter(t => t.id !== id);
                if (this.test && this.test.id === id) {
                    this.test = null;
                }
            } finally {
                this.loading = false;
            }
        },
    }
});
