// stores/test-editor/test.actions.ts
import type { Test } from '@/types/types';
import testService from '@/services/testService';
import { useAuthStore } from '@/stores/useAuthStore';
import type { TestEditorState } from './types';

export const testActions = {

    /**
     * 'this: TestEditorState' argument is not needed with ordinary pinia actions. It is needed only here,
     * because the way how I split the useTestEditorStore actions into multiple files. These files
     * still need access to the store state. So, in this app, every action will have
     * 'this: TestEditorState'.
     * 'this: TestEditorState' = to the store state. Why? TS magic + Pinia binding magic together.
     */
    async get(this: TestEditorState, id: number): Promise<Test> {
        this.loading = true;

        try {
            const test = await testService.get(id);

            this.test = test;

            return test;
        } catch (error) {
            throw error;
        } finally {
            this.loading = false;
        }
    },

    async getByCode(this: TestEditorState, testCode: string): Promise<Test> {
        this.loading = true;

        try {
            const test = await testService.getByCode(testCode);

            this.test = test;

            return test;
        } catch (error) {
            throw error;
        } finally {
            this.loading = false;
        }
    },

    /**
     * Sends a test update request from FE to BE. Only in 'edit' mode.
     * Here we send the whole test object, with all the test data, questions and answer options.
     */
    async update(this: TestEditorState ): Promise<Test> {
        this.loading = true;

        try {
            if (!this.test) {
                throw new Error('No test loaded to update');
            }

            const testFromBackend = await testService.update(this.test);
            this.test = testFromBackend;
            return testFromBackend;

        } catch (error) {
            throw error;
        } finally {
            this.loading = false;
        }
    },

    /**
     * Create a new dummy test in the store, with empty title, description. In 'create' mode, in FE only.
     */
    initializeNewTest(this: TestEditorState): void {
        const authStore = useAuthStore();

        if (!authStore.userId) {
            throw new Error('User not authenticated');
        }

        this.test = {
            title: '',
            description: '',
            questions: [],
        };
    },

    /**
     * Sends a create request from FE to BE. Only in 'create' mode.
     * We send one big request, with all the test data, questions and answer options.
     */
    async create(this: TestEditorState): Promise<Test> {
        if (!this.test) {
            throw new Error('No test data to create');
        }

        this.loading = true;

        try {
            const createdTest = await testService.create(this.test);

            this.test = createdTest;

            return createdTest;
        } catch (error) {
            throw error;
        } finally {
            this.loading = false;
        }
    },
};
