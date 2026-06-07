import { nextTick, provide, ref } from 'vue';

export function useSubmitStopper() {

    /**
     * Whether the test taker has selected an answer option for each question.
     */
    const hasValidationError = ref(false);

    /**
     * Used for triggering the validation in the AnswerOptionList component.
     */
    const validationCycle = ref(0);

    /**
     * This function will be provided/injected to the AnswerOptionList, so it can call it.
     */
    const reportError = () => {
        hasValidationError.value = true;
    };

    /**
     * We provide the reportError() to the AnswerOptionList. This function can send back here a feedback
     * if our manual validation has found any validation errors.
     */
    provide('reportError', reportError);

    /**
     * We provide the validationCycle to the AnswerOptionList. It's purpose is to trigger the validation
     * in the AnswerOptionList, by changing its value. So, this is in the end a counter. We use a counter,
     * because we may need to trigger the validation multiple times. This can't be done with a boolean.
     */
    provide('validationCycle', validationCycle);

    /**
     * Validates answer option selections for all questions in the test.
     * Returns true if validation passes, false if there are validation errors.
     */
    const validateSelectAnswerOptions = async (): Promise<boolean> => {

        // Reset the validation error before validating the answer options, so that if the user has
        // fixed the error, it will not be shown again.
        hasValidationError.value = false;

        // Trigger the validation in the AnswerOptionList component, which will call the
        // reportError() if there is a validation error (missing answer option selection for a question)
        validationCycle.value++;

        // Wait for the DOM to update after changing the validationCycle, so that the validation in
        // the AnswerOptionList can run and report any errors.
        await nextTick();

        // Return whether validation passed
        return !hasValidationError.value;
    };

    return {
        validateSelectAnswerOptions
    };

}
