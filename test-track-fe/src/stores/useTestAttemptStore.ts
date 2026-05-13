import { defineStore } from 'pinia';
import type { TestAttempt } from '@/types/types';
import type { UserAnswer } from '@/types/types';


export const useTestAttemptStore = defineStore('testAttempt', {

    state: () => ({
        testAttempts: [] as TestAttempt[],

        testAttempt: {} as Partial<TestAttempt>,

        userAnswers: [] as Partial<UserAnswer>[],
    }),

    actions: {

        // Called when user selects an answer
        selectAnswer(questionId: number, answerId: number) {
            
            const existing = this.userAnswers.find(ua => ua.question_id === questionId);
            if (existing) {
                existing.answer_option_id = answerId;
            } else {
                this.userAnswers.push({
                    question_id: questionId,
                    answer_option_id: answerId,
                    // Other fields as needed
                });
            }
        },

        // Called on submit
        getSubmissionData() {
            return {
                testAttempt: this.testAttempt,
                userAnswers: this.userAnswers,
            };
        },

        // Reset after submit
        reset() {
            this.testAttempt = {};
            this.userAnswers = [];
        }
    }
});
