// stores/test-editor/question.actions.ts
import type { Question, AnswerOption } from '@/types/types';
import questionService from '@/services/questionService';
import type { TestEditorState } from './types';
import { requireQuestion, createFrontendId } from './helpers';

export const questionActions = {

    /**
     * Only in 'create' mode, and only on FE. Adds new question to the test in the store.
     */
    addNewQuestion(this: TestEditorState): void {
        if (!this.test) {
            throw new Error('No test loaded to add a question to');
        }

        this.test.questions?.push({
            id: createFrontendId(),
            text: '',
            answer_options: [] as AnswerOption[],
        } as Question);
    },

    /**
     * Sets question text in frontend, here in the store, both in 'create' and 'edit' mode.
     * Updates the text of a question in the current test. This is used in the Question.vue component
     * to update the question text in the store, when the tester edits the question text.
     * So, this action does not work with BE, works with FE. Hence, we do not have here
     * async/await, try/catch, loading, etc.
     */
    setQuestionTextInStore(
        this: TestEditorState,
        questionId: number | string,
        text: string
    ): void {
        const question = requireQuestion(this.test?.questions, questionId);

        question.text = text;
    },

    /**
     * Update the question text in the backend.
     * Only for 'edit' mode.
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

    /**
     * Used only in 'create' mode, works only on FE. That is the only place, when question can be deleted, because
     * later the test items must not change, to keep the integrity of the test for longitudinal testing.
     * And in 'create' mode, we use FE-only ids, that are strings.
     */
    deleteQuestion(this: TestEditorState, questionId: string): void {
        if (!this.test) {
            throw new Error('No test loaded to delete a question from');
        }

        this.test.questions = this.test.questions?.filter(q => q.id !== questionId);
    },


};
