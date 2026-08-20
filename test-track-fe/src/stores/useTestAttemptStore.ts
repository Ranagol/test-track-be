import { defineStore } from 'pinia';
import type { UserAnswer } from '@/types/types';
import type { PaginationMeta, PaginationLinks, TestAttempt } from '@/types/types';
import type { TestAttemptQueryParams } from '@/types/types';
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

        /**
         * This here is for preventing race conditions when multiple requests are made to the backend
         */
        requestId: 0,
    }),

    actions: {

        /**
         * Gets all test attempts from the backend, with pagination, sorting and searching.
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

                const response = await testAttemptService.getAll({
                    searchTerm: this.searchTerm,
                    sort_by: this.sortBy,
                    sort_order: this.sortOrder,
                    page: this.currentPage,
                    per_page: this.pageSize
                });

                /**
                 * Only update the store if this is still the latest request. Meaning... If request
                 * 1 arrives after request 3, below we will have 1 !== 3, and we will not update the
                 * store. Aka, we will not have the final search term to be 'a'. It will be still 'abc'.
                 */
                if (requestId === this.requestId) {
                    this.testAttempts = response.data;
                    this.pagination = response.meta;
                    this.paginationLinks = response.links;
                }
            } finally {
                this.loading = false;
            }
        },

        /**
         * The test taker will select an answer option for a question. Once. Then he maybe changes
         * his mind and selects another answer option for the same question. Every time he selects
         * an answer option for a question, we call this method, to update the userAnswers array in the store.
         *
         * So, there are two situations here.
         * 1. At the beginning of the test, the userAnswers array is empty. No user answers.
         * 2. Test taker changes his already existing answer. So, there is already a UserAnswer for
         * the question, but now we need to change it.
         *
         * @param questionId        This will not change, it will be always the same question.
         * @param answerOptionId    This can be null, or it can change, if the user changes his
         * answer.
         */
        updateUserAnswers(questionId: number, answerOptionId: number ): void {

            /**
             * Check if there is already an existing answer for this question.
             */
            const existingAnswer = this.userAnswers.find(
                userAnswer => userAnswer.question_id === questionId
            );

            /**
             * If there is already an existing UserAnswer for this question, update the
             * answer_option_id. Otherwise, add a new UserAnswer to the userAnswers array. (situation 2)
             */
            if (existingAnswer) {

                // We use the '!' to tell TS, that UserAnswer exist.
                existingAnswer!.answer_option_id = answerOptionId;

            } else {

                // If there is no existing UserAnswer for this question, create it (situation 1)
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
