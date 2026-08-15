// stores/test-editor/answerOption.actions.ts
import type { AnswerOption } from '@/types/types';
import type { TestEditorState } from './types';
import { requireQuestion, requireAnswerOption, createFrontendId } from './helpers';

export const answerOptionActions = {

    /**
     * In 'create' mode, adds new answer option to the question in the store.
     */
    addNewAnswerOption(this: TestEditorState, questionId: string): void {
        const question = requireQuestion(this.test?.questions, questionId);

        if (!question.answer_options) {
            throw new Error('Answer options array not found');
        }

        question.answer_options.push({
            id: createFrontendId(),
            text: '',
            is_correct: false,
        } as AnswerOption);
    },

    /**
     * In 'create' mode, sets the is_correct of the answer option to true, and all else
     * answer options to the same question as false.
     */
    setAnswerOptionIsCorrectInStore(
        this: TestEditorState,
        questionId: number | string,
        answerOptionId: number | string
    ): void {
        const question = requireQuestion(this.test?.questions, questionId);

        if (!question.answer_options) {
            throw new Error('Answer options array not found');
        }

        question.answer_options.forEach(answerOption => {

            /**
             * Loops through all answer options of the question. Previously the tester selected
             * one answer option as correct. This answer option will be set to is_correct = true.
             * All other answer options of the question will be set to is_correct = false.
             */
            answerOption.is_correct = answerOption.id === answerOptionId;
        });
    },


    setAnswerOptionTextInStore(
        this: TestEditorState,
        questionId: number | string,
        answerOptionId: number | string,
        answerOptionText: string,
    ): void {
        const question = requireQuestion(this.test?.questions, questionId);

        if (!question.answer_options) {
            throw new Error('Answer options array not found');
        }

        const answerOption = requireAnswerOption(question.answer_options, answerOptionId);

        answerOption.text = answerOptionText;
    },

    /**
     * Only in 'create' mode, and only on FE.
     */
    deleteAnswerOption(
        this: TestEditorState,
        questionId: string,
        answerOptionId: string
    ): void {
        const question = requireQuestion(this.test?.questions, questionId);

        if (!question.answer_options) {
            throw new Error('Answer options array not found');
        }

        question.answer_options = question.answer_options.filter(ao => ao.id !== answerOptionId);

    },

};
