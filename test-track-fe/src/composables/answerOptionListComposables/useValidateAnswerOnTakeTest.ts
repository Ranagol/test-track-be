import { watch, inject, type Ref } from 'vue';

export const useValidateAnswerOnTakeTest = (

    selectedAnswerOption: Ref<number | string | null>,

    emitShowError: (show: boolean) => void

) => {

    /**
     * We inject the reportError() function, provided by TestTakePage.
     */
    const reportError = inject<() => void>('reportError');

    //todo andor why to use Ref and not ref()
    const validationCycle = inject<Ref<number>>('validationCycle');

    /**
     * This function will:
     * 1. trigger the showing of the validation error message
     * 2. stop the submitting a request to the BE.
     */
    const validateAnswerOptionSelection = () => {

        // If there is no selected answer option for this question...
        if (selectedAnswerOption.value === null) {

            // ... then show the error message for this question...
            emitShowError(true);

            // ... and report the error to the TestTakePage, so it can stop the test attempt submission.
            reportError?.();
        }
    };

    /**
     * When the validationCycle changes, it means that the TestTakePage sent a signal: hey, please check
     * if the test take has selected anser option for his questions.
     * So, watcher then triggers the validateAnswerOptionSelection() function.
     */
    watch(validationCycle!, () => {
        validateAnswerOptionSelection();
    });

};
