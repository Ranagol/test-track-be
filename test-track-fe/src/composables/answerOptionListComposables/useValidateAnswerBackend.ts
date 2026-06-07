import { computed, type Ref, watch } from 'vue';

/**
 * Composable for handling backend validation errors for answer options in a Vue component.
 */
export function useValidateAnswerBackend(
    emitShowError: (value: boolean) => void,
    selectedAnswerOption: Ref<number | string | null>,
    beValidationErrors: Record<string, string[]>,
    questionIndex: number
) {

    const backendValidationErrorMessage = computed(() => {
        return beValidationErrors?.[`questions.${questionIndex}.answer_options`]?.[0] || null;
    });

    watch(
        () => backendValidationErrorMessage.value,
        () => {
            checkForAnswerOptionBackendValidation();
        }
    );

    /**
     * Decides whether to show the validation error message for missing correct answer option selection.
     * It is triggered only on mount, by a watcher. For BACKEND VAL ERRORS..
     */
    const checkForAnswerOptionBackendValidation = (): void => {


        if (backendValidationErrorMessage.value && selectedAnswerOption.value === null) {

            emitShowError(true);
            return;
        }

        emitShowError(false);
    };
};
