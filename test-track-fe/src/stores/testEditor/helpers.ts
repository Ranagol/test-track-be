// stores/test-editor/helpers.ts
import type { Question, AnswerOption } from '@/types/types';

/**
 * Creates uuid string for FE usage. This is used for FE-only entities, that do not have an id from
 * the backend, like new questions and new answer options.
 */
export function createFrontendId(): string {
    return crypto.randomUUID();
}

/**
 * Requires, finds the needed question.
 */
export function requireQuestion(
    questions: Question[] | undefined,
    questionId: number | string,
): Question {

    const question = questions?.find(q => q.id === questionId);

    if (!question) {
        throw new Error('Question not found');
    }

    return question;
}

/**
 * Requires, finds the needed answer option.
 */
export function requireAnswerOption(
    answerOptions: AnswerOption[] | undefined,
    answerOptionId: number | string,
): AnswerOption {

    const answerOption = answerOptions?.find(ao => ao.id === answerOptionId);

    if (!answerOption) {
        throw new Error('Answer option not found');
    }

    return answerOption;
}
