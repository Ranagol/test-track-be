// stores/test-editor/answerOption.actions.ts
import type { AnswerOption } from '@/types/types';
import answerOptionService from '@/services/answerOptionService';
import type { TestEditorState } from './types';
import { requireQuestion, requireAnswerOption, createFrontendId } from './helpers';

export const answerOptionActions = {

    addNewAnswerOption(this: TestEditorState, questionId: number): void {
        const question = requireQuestion(this.test?.questions, questionId);

        if (!question.answer_options) {
            throw new Error('Answer options array not found');
        }

        question.answer_options.push({
            frontendId: createFrontendId(),
            text: '',
            is_correct: false,
        } as AnswerOption);
    },

    setAnswerOptionIsCorrectInStore(this: TestEditorState, questionId: number, answerOptionId: number): void {
        const question = requireQuestion(this.test?.questions, questionId);

        if (!question.answer_options) {
            throw new Error('Answer options array not found');
        }

        question.answer_options.forEach(answerOption => {
            answerOption.is_correct = answerOption.id === answerOptionId;
        });
    },

    setAnswerOptionTextInStore(
        this: TestEditorState,
        questionId: number,
        answerOptionId: number,
        answerOptionText: string,
    ): void {
        const question = requireQuestion(this.test?.questions, questionId);

        if (!question.answer_options) {
            throw new Error('Answer options array not found');
        }

        const answerOption = requireAnswerOption(question.answer_options, answerOptionId);

        answerOption.text = answerOptionText;
    },

    async updateAnswerOptionText(
        this: TestEditorState,
        questionId: number,
        answerOptionId: number,
        answerOptionText: string,
    ): Promise<void> {
        this.loading = true;

        try {
            const question = requireQuestion(this.test?.questions, questionId);

            if (!question.answer_options) {
                throw new Error('Answer options array not found');
            }

            const answerOption = requireAnswerOption(question.answer_options, answerOptionId);

            answerOption.text = answerOptionText;

            await answerOptionService.updateText(answerOptionId, {
                text: answerOption.text,
            });
        } catch (error) {
            throw error;
        } finally {
            this.loading = false;
        }
    },

    async updateAnswerOptionIsCorrect(
        this: TestEditorState,
        questionId: number,
        answerOptionId: number,
    ): Promise<void> {
        this.loading = true;

        try {
            this.setAnswerOptionIsCorrectInStore(questionId, answerOptionId);

            await answerOptionService.updateIsCorrect(questionId, answerOptionId);
        } catch (error) {
            throw error;
        } finally {
            this.loading = false;
        }
    },
};
