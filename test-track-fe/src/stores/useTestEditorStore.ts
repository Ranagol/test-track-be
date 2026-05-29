import { defineStore } from 'pinia';
import type { Question, Test, AnswerOption } from '@/types/types';
import testService from '@/services/testService';
import questionService from '@/services/questionService';
import answerOptionService from '@/services/answerOptionService';
import { useAuthStore } from './useAuthStore';

export const useTestEditorStore = defineStore('testEditor', {

    state: () => ({
        test: null as null | Test,
        loading: false as boolean,
    }),

    actions: {

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

                return testFromBackend;
            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        initializeNewTest(): void {
            const authStore = useAuthStore();

            if (!authStore.userId) {
                throw new Error('User not authenticated');
            }

            this.test = {
                user_id: authStore.userId,
                title: '',
                description: '',
                questions: [],
            };
        },

        async create(): Promise<Test> {

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

        /**
         * QUESTION CRUD OPERATIONS
         */

        addNewQuestion(): void {

            if (!this.test) {
                throw new Error('No test loaded to add a question to');
            }

            this.test.questions?.push({
                text: '',
                // answer_options: [
                //     {
                //         text: '',
                //         is_correct: false,
                //     }
                // ] as AnswerOption[],
            } as Question);
        },

        /**
         * Sets question text in frontend, here in the store.
         * Updates the text of a question in the current test. This is used in the Question.vue component
         * to update the question text in the store, when the tester edits the question text.
         * So, this action does not work with BE, works with FE. Hence, we do not have here
         * async/await, try/catch, loading, etc.
         */
        setQuestionTextInStore(questionId: number, text: string) {

            const question = this.test?.questions?.find(
                question => question.id === questionId
            );

            if (!question) return;

            question.text = text;
        },

        /**
         * Update the question text in the backend,
         */
        async updateQuestionInBackend(questionId: number): Promise<void> {
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

            } catch (error) {
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * ANSWER OPTION CRUD OPERATIONS
         */

        addNewAnswerOption(questionId: number): void {

            const question = this.test?.questions?.find(
                question => question.id === questionId
            );

            if (!question) {
                throw new Error('Question not found');
            }

            if (!question.answer_options) {
                throw new Error('Answer options array not found');
            }

            question.answer_options.push({
                text: '',
                is_correct: false,
            } as AnswerOption);
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
