import { defineStore } from 'pinia';
import type { Test, PaginationMeta, PaginationLinks } from '@/types/types';
import testService from '@/services/testService';
import type { TestQueryParams } from '@/types/types';
import questionService from '@/services/questionService';
import answerOptionService from '@/services/answerOptionService';

export const useTestsStore = defineStore('tests', {

    state: () => ({
        tests: [] as Test[],
        test: null as null | Test,
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

        /**
         * TEST CRUD OPERATIONS
         */

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

        async get(id: number): Promise<Test> {
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

        async getByCode(testCode: string): Promise<Test> {
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

        async create(data: Test): Promise<Test> {
            this.loading = true;
            try {
                const test = await testService.create(data);
                this.tests.push(test);
                return test;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async update(id: number): Promise<Test> {
            this.loading = true;
            try {

                if (!this.test) {
                    throw new Error('No test loaded to update');
                }

                const updateData = {
                    title: this.test.title,
                    description: this.test.description,
                };

                // Update on backend
                const testFromBackend = await testService.update(id, updateData);

                // Update the test in the store's tests array
                const index = this.tests.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.tests[index] = testFromBackend;
                }

                return testFromBackend;
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

                // Remove the individual test from store too, if it is the one being deleted here
                if (this.test && this.test.id === id) {
                    this.test = null;
                }
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * QUESTION CRUD OPERATIONS
         */

        /**
         * Updates the text of a question in the current test. This is used in the Question.vue component
         * to update the question text in the store, when the tester edits the question text.
         * So, this action does not work with BE, works with FE. Hence, we do not have here
         * async/await, try/catch, loading, etc.
         */
        updateQuestionText(index: number, text: string) {
            if (!this.test?.questions?.[index]) return
            this.test.questions[index].text = text
        },

        async updateQuestion(questionId: number): Promise<void> {
            this.loading = true;

            try {

                const questions = this.test?.questions;

                if (!questions) {
                    throw new Error('No questions loaded');
                }

                // The test.questions..question is already updated with the new text, because we use v-model in the Question.vue component,
                const question = questions.find(question => question.id === questionId);

                if (!question) {
                    throw new Error(`Question with ID ${questionId} not found`);
                }

                // Send update to backend
                await questionService.update(questionId, { text: question.text });

                // Also update in the tests.questions array
                if (this.test?.id) {
                    const currentTestId = this.test.id;

                    // find in tests array the current test
                    const testInArray = this.tests.find(t => t.id === currentTestId);
                    if (testInArray?.questions) {

                        // find in the test.questions array the current question in array
                        const questionInArray = testInArray.questions.find(q => q.id === questionId);
                        if (questionInArray) {
                            questionInArray.text = question.text;
                        }
                    }
                }
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        setAnswerOptionTextInStore(questionId: number, answerOptionId: number, answerOptionText: string): void {

            // Find the question in the current test
            const question = this.test?.questions?.find(q => q.id === questionId);

            if (!question) {
                throw new Error('Question not found');
            }

            if (!question.answer_options) {
                throw new Error('Answer options array not found');
            }

            // Find the answer option in the question
            const answerOption = question.answer_options.find(ao => ao.id === answerOptionId);

            if (!answerOption) {
                throw new Error('Answer option object not found');
            }

            // Update the answer option text in the store, so the UI is updated immediately
            answerOption.text = answerOptionText;
        },

        /**
         * Handles the update of an answer option.
         */
        async updateAnswerOptionText(
                questionId: number,
                answerOptionId: number,
                answerOptionText: string,
        ): Promise<void> {
            this.loading = true;

            try {

                // Find the question in the current test
                const question = this.test?.questions?.find(q => q.id === questionId);

                if (!question) {
                    throw new Error('Question not found');
                }

                if (!question.answer_options) {
                    throw new Error('Answer options array not found');
                }

                // Find the answer option in the question
                const answerOption = question.answer_options.find(ao => ao.id === answerOptionId);

                if (!answerOption) {
                    throw new Error('Answer option object not found');
                }

                // Update the answer option text and is_correct in the store, so the UI is updated immediately
                answerOption.text = answerOptionText;

                // Send update to backend
                const answerOptionNew = {
                    text: answerOption.text,
                }

                await answerOptionService.updateText(answerOptionId, answerOptionNew);

            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateAnswerOptionIsCorrect(questionId: number, answerOptionId: number): Promise<void> {
            //TODO ANDOR Do I need loading here at all?  .This question goes for all actions here.
            this.loading = true;
            try {

                // Find the question in the current test
                const question = this.test?.questions?.find(q => q.id === questionId);

                if (!question) {
                    throw new Error('Question not found');
                }

                if (!question.answer_options) {
                    throw new Error('Answer options array not found');
                }

                // Update the is_correct property of the answer options in the store, so the UI is updated immediately
                question.answer_options.forEach(ao => {
                    ao.is_correct = ao.id === answerOptionId;
                });

                // Send update to backend
                await answerOptionService.updateIsCorrect(questionId, answerOptionId);

            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
