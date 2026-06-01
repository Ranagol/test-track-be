import { defineStore } from 'pinia';
import type { UserAnswer } from '@/types/types';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Test, BackendError, PaginationMeta, PaginationLinks, TestAttempt } from '@/types/types';
import type { TestQueryParams } from '@/types/types';
import testAttemptService from '@/services/testAttemptService';

/**
 * This store is used to collect user answers for a TestAttempt, so at the end this TestAttempt
 * could be recorded in the db.
 */
export const useTestAttemptStore = defineStore('testAttempt', {

    state: () => ({
        testAttempts: [] as TestAttempt[],//right now this is not used for anything
        testAttempt: {} as Partial<TestAttempt>,

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
         * At the beginning of the test, this array is empty. No user answers. This is case 1.
         * User starts answering questions. Then, this array will have UserAnswer objects, that
         * contain the question_id and the answer_option_id.
         * Now comes case 2. This is when the user changes his already existing answer.
         * All in all, we collecte here the user answers, during the test. And we collect user
         * answers in Test Attempt store, because UserAnswer is mandatory part of TestAttempt.
         */
        userAnswers: [] as Partial<UserAnswer>[],
    }),

    actions: {

        async getAll(): Promise<void> {
            this.loading = true;
            try {
                const response = await testAttemptService.getAll(
                    {
                        searchTerm: this.searchTerm,
                        sort_by: this.sortBy,
                        sort_order: this.sortOrder,
                        page: this.currentPage,
                        per_page: this.pageSize
                    } as TestQueryParams
                );
                this.testAttempts = response.data;
                this.pagination = response.meta;
                this.paginationLinks = response.links;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Collects user answers.
         *
         * @param questionId        This will not change, it will be always the same.
         * @param answerOptionId    This can be null, or it can change, if the user changes his answer to a question.
         */
        updateUserAnswers(questionId: number, answerOptionId: number | string): void {

            /**
             * Check if there is already an existing answer for this question. findIndex will return
             * -1 if there is no existing answer, or if an answer exists, it will return its index.
             */
            const existingAnswerIndex = this.userAnswers.findIndex(
                userAnswer => userAnswer.question_id === questionId
            );

            // If there is already an existing UserAnswer for this question, update the answer_option_id. Otherwise, add a new UserAnswer to the userAnswers array.
            if (existingAnswerIndex !== -1) {
                // We use the '!' to tell TS, that UserAnswer exist.
                this.userAnswers[existingAnswerIndex]!.answer_option_id = answerOptionId;
            } else {
                // If there is no existing UserAnswer for this question, create it.
                this.userAnswers.push({
                    question_id: questionId,
                    answer_option_id: answerOptionId,
                });
            }
        },

        resetTestAttempt(): void {
            this.testAttempt = {};
            this.userAnswers = [];
        },
    }
});
