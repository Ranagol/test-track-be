import { ref, type Ref } from 'vue';
import type { FormInstance } from 'element-plus';

/**
 * Validates the test form on both frontend and backend levels. Because our form could have
 * validation errors both from BE and FE.
 * As a validator, it returns true if validation passes, false if there are validation errors.
 */
export function useTestValidator(
    validationRef: Ref<FormInstance | undefined>,
    backendValidationErrors: Record<string, any>
) {

    // We use async, because validation is async in Element Plus
    const validateTest = async (): Promise<boolean> => {

        // If the form is not mounted yet, we can't validate it, so we return false.
        if (!validationRef.value) {
            return false;
        }

        // Reset all validation errors from BE, by looping through the keys of the object
        Object.keys(backendValidationErrors).forEach(
            key => { delete backendValidationErrors[key]}
        );

        // Reset all validation errors on FE, with the default clearValidate() method of Element Plus
        validationRef.value?.clearValidate();

        /**
         * We use try, because the validate() method of Element Plus can throw an error.
         */
        try {
            const valid = await validationRef.value.validate();
            return valid;
        } catch {
            return false;
        }
    };

    return {
        validateTest
    }
};
