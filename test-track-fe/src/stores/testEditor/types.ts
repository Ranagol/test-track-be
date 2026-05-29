import type { Test } from '@/types/types';

/**
 * This is just a TS type, for an object that has test and loading. The useTestEditorStore
 * is like that.
 * Now, we use this: TestEditorState, then this is = to the store state. Why? TS magic + Pinia
 * binding magic together.
 */
export type TestEditorState = {
    test: Test | null;
    loading: boolean;
    setAnswerOptionIsCorrectInStore(questionId: number, answerOptionId: number): void;
};
