import { defineStore } from 'pinia';
import type { Test } from '@/types/types';
import testService from '@/services/testService';
import questionService from '@/services/questionService';
import answerOptionService from '@/services/answerOptionService';

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

        async create(data: Test): Promise<Test> {
            this.loading = true;
            try {
                const test = await testService.create(data);
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
