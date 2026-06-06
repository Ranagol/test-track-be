import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import type { Question } from '@/types/types';

export function useSelectAnswer(
    mode: 'take' | 'create' | 'edit',
    question: Question
) {

    const testAttemptStore = useTestAttemptStore();
    const testEditorStore = useTestEditorStore();

    /**
     * Answer selection happens in 3 cases in this component:
     * 1. When the test taker selects an answer option during test taking (mode = 'take'),
     * 2. When the tester selects the correct answer option during test creation (mode = 'create').
     * 3. When the tester selects the correct answer option during test editing (mode = 'edit').
     */
    const handleAnswerSelection = (answerOptionId: number | string | null) => {

        // For test taking (UserAnswer) - the user has selected this answer for the given question
        if (mode === 'take' && typeof question.id === 'number' && typeof answerOptionId === 'number') {
            testAttemptStore.updateUserAnswers(
                question.id,
                answerOptionId
            );
        }

        // Deciding what is the correct AO, 'create' mode, when a test is being created
        if (mode === 'create' && typeof question.id === 'string' && typeof answerOptionId === 'string') {
            testEditorStore.setAnswerOptionIsCorrectInStore(
                question.id,
                answerOptionId
            );
        }

        // Setting the correct AO can happen in 'edit' mode
        if (mode === 'edit' && typeof question.id === 'number' && typeof answerOptionId === 'number') {
            testEditorStore.setAnswerOptionIsCorrectInStore(
                question.id,
                answerOptionId
            );
        }
    };

    return {
        handleAnswerSelection
    }

};
