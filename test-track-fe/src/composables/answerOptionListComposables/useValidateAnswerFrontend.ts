import { watch } from 'vue';

export function useValidateAnswerFrontend(
    emitShowError: (show: boolean) => void,
    selectedAnswerOption: { value: number | string | null }
) {

    /**
     * Decides whether to show the validation error message for missing correct answer option selection.
     * It only works for FE, and it used constantly.
     */
    const checkIfAnswerOptionSelected = (): void => {

        if (selectedAnswerOption.value === null) {

            emitShowError(true);
            return;
        }

        emitShowError(false);
    };

    watch(
        () => selectedAnswerOption.value,
        () => {
            checkIfAnswerOptionSelected();
        },
    );

    return {
        checkIfAnswerOptionSelected
    };
}
