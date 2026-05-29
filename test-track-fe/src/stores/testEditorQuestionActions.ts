import type { AnswerOption, Question, Test } from '@/types/types';
import questionService from '@/services/questionService';
import answerOptionService from '@/services/answerOptionService';

type TestEditorStoreContext = {
    test: Test | null;
    loading: boolean;
    createFrontendId(): string;
    setAnswerOptionIsCorrectInStore(questionId: number, answerOptionId: number): void;
};

export function addNewQuestion(this: TestEditorStoreContext): void {

    if (!this.test) {
        throw new Error('No test loaded to add a question to');
    }

    this.test.questions?.push({

        frontendId: this.createFrontendId(),
        text: '',
        answer_options: [
            {
                frontendId: this.createFrontendId(),
                text: '',
                is_correct: false,
            }
        ] as AnswerOption[],
    } as Question);
}

export function setQuestionTextInStore(this: TestEditorStoreContext, questionId: number, text: string): void {

    const question = this.test?.questions?.find(
        question => question.id === questionId
    );

    if (!question) {
        return;
    }

    question.text = text;
}

export async function updateQuestionInBackend(this: TestEditorStoreContext, questionId: number): Promise<void> {

    this.loading = true;

    try {

        const questions = this.test?.questions;

        if (!questions) {
            throw new Error('No questions loaded');
        }

        const question = questions.find(question => question.id === questionId);

        if (!question) {
            throw new Error(`Question with ID ${questionId} not found`);
        }

        await questionService.update(questionId, { text: question.text });

    } catch (error) {
        throw error;
    } finally {
        this.loading = false;
    }
}

export function addNewAnswerOption(this: TestEditorStoreContext, questionId: number): void {

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
        frontendId: this.createFrontendId(),
        text: '',
        is_correct: false,
    } as AnswerOption);
}

export function setAnswerOptionIsCorrectInStore(this: TestEditorStoreContext, questionId: number, answerOptionId: number): void {

    const question = this.test?.questions?.find(q => q.id === questionId);

    if (!question) {
        throw new Error('Question not found');
    }

    if (!question.answer_options) {
        throw new Error('Answer options array not found');
    }

    question.answer_options.forEach(answerOption => {
        answerOption.is_correct = answerOption.id === answerOptionId;
    });
}

export function setAnswerOptionTextInStore(
    this: TestEditorStoreContext,
    questionId: number,
    answerOptionId: number,
    answerOptionText: string,
): void {

    const question = this.test?.questions?.find(q => q.id === questionId);

    if (!question) {
        throw new Error('Question not found');
    }

    if (!question.answer_options) {
        throw new Error('Answer options array not found');
    }

    const answerOption = question.answer_options.find(ao => ao.id === answerOptionId);

    if (!answerOption) {
        throw new Error('Answer option object not found');
    }

    answerOption.text = answerOptionText;
}

export async function updateAnswerOptionText(
    this: TestEditorStoreContext,
    questionId: number,
    answerOptionId: number,
    answerOptionText: string,
): Promise<void> {

    this.loading = true;

    try {

        const question = this.test?.questions?.find(q => q.id === questionId);

        if (!question) {
            throw new Error('Question not found');
        }

        if (!question.answer_options) {
            throw new Error('Answer options array not found');
        }

        const answerOption = question.answer_options.find(ao => ao.id === answerOptionId);

        if (!answerOption) {
            throw new Error('Answer option object not found');
        }

        answerOption.text = answerOptionText;

        const answerOptionNew = {
            text: answerOption.text,
        };

        await answerOptionService.updateText(answerOptionId, answerOptionNew);

    } catch (error) {
        throw error;
    } finally {
        this.loading = false;
    }
}

export async function updateAnswerOptionIsCorrect(
    this: TestEditorStoreContext,
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
}