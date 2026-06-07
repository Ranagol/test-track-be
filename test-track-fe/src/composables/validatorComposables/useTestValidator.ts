import { ref, type Ref } from 'vue';
import type { FormInstance } from 'element-plus';

export function useTestValidator(
    validationRef: Ref<FormInstance | undefined>,
    backendValidationErrors: object
): {
    validateTest: () => Promise<boolean>;
} {

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
