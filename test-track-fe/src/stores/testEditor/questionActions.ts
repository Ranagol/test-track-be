// stores/test-editor/question.actions.ts
import type { Question, AnswerOption } from '@/types/types';
import questionService from '@/services/questionService';
import type { TestEditorState } from './types';
import { requireQuestion, createFrontendId } from './helpers';

export const questionActions = {

    addNewQuestion(this: TestEditorState): void {
        if (!this.test) {
            throw new Error('No test loaded to add a question to');
        }

        this.test.questions?.push({
            frontendId: createFrontendId(),
            text: '',
            answer_options: [
                {
                    frontendId: createFrontendId(),
                    text: '',
                    is_correct: false,
                },
            ] as AnswerOption[],
        } as Question);
    },

    /**
     * Sets question text in frontend, here in the store.
     * Updates the text of a question in the current test. This is used in the Question.vue component
     * to update the question text in the store, when the tester edits the question text.
     * So, this action does not work with BE, works with FE. Hence, we do not have here
     * async/await, try/catch, loading, etc.
     */
    setQuestionTextInStore(this: TestEditorState, questionId: number, text: string): void {
        const question = requireQuestion(this.test?.questions, questionId);

        question.text = text;
    },

    /**
     * Update the question text in the backend
     */
    async updateQuestionInBackend(this: TestEditorState, questionId: number): Promise<void> {
        this.loading = true;

        try {

            const question = requireQuestion(this.test?.questions, questionId);

            await questionService.update(questionId, {
                text: question.text,
            });

        } catch (error) {
            throw error;
        } finally {
            this.loading = false;
        }
    },
};
