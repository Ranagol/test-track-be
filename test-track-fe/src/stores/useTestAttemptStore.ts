import { defineStore } from 'pinia';
import type { TestAttempt } from '@/types/types';
import type { UserAnswer } from '@/types/types';
import { useAuthStore } from '@/stores/useAuthStore';


export const useTestAttemptStore = defineStore('testAttempt', {

    state: () => ({
        testAttempts: [] as TestAttempt[],

        testAttempt: {} as Partial<TestAttempt>,

        /**
         * At the beginning of the test, this array is empty. This is case 1.
         * User starts answering questions. Then, this array will have UserAnswer objects, that
         * contain the question_id and the answer_option_id.
         * Now comes case 2. This is when the user changes his already existing answer.
         */
        userAnswers: [] as Partial<UserAnswer>[],
    }),

    actions: {

        /**
         *
         * @param questionId        This will not change, it will be always the same.
         * @param answerOptionId    This can be null, or it can change, if the user changes his answer to a question.
         */
        updateUserAnswers(questionId: number, answerOptionId: number): void {

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
