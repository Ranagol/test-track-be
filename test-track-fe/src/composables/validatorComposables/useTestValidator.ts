import { ref } from 'vue';
import type { FormInstance } from 'element-plus';

export function useTestValidator(backendValidationErrors: object) {

    /**
     * Validates the test form on FE. All, except the answer option selection.
     * Contains a reactive reference to the form, used for validation before test creation. So, thorugh
     * this, we can access title, description and all the questions and answer options, to validate them.
     */
    const validationRef = ref<FormInstance>();

    /**
     * Validates the test form on both frontend and backend levels.
     * Returns true if validation passes, false if there are validation errors.
     */
    const validateTest = async (): Promise<boolean> => {

        // Reset all validation errors from BE.
        backendValidationErrors = {}

        // Reset all validation errors on FE.
        validationRef.value?.clearValidate()

        if (!validationRef.value) {
            return false
        }

        const valid = await validationRef.value.validate()

        return valid
    };

    return {
        validateTest
    }
};
