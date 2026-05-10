import { defineStore } from 'pinia';
import type { Test, BackendError } from '@/types/types';
import testService from '@/services/testService';

export const useTestsStore = defineStore('tests', {

    state: () => ({
        tests: [] as Test[],
        test: null as null | Test,
        loading: false as boolean,
    }),

    actions: {

        async getAll(): Promise<void> {
            this.loading = true;
            try {
                const tests = await testService.getAll();
                this.tests = tests;
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
        }
    }
});
