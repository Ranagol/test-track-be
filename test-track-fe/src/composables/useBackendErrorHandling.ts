import { ref } from 'vue'
import axios from 'axios'
import type { BackendError } from '@/types/types';

/**
 * Composable for handling login and register backend validation errors feedback in a Vue component.
 */
export function useBackendErrorHandling() {

    /**
     * Stores error messages from backend.
     * This is a ref({}), meaning this will be a reactive object. We start here with an empty {}, and
     * later we expect here a object.
     * <string, string[]> This will be abject with string keys and array of string values
     */
    const backendErrors = ref<BackendError>({});

    /**
     * All errors from backend that are not validation errors. Example: not internet, server down,
     * unexpected error...
     */
    const generalError = ref<string>('');

    const handleBackendErrors = (error: unknown): void => {

        // Reset previous errors
        backendErrors.value = {}
        generalError.value = ''
        const fallbackMessage = 'An unexpected error occurred. Please try again later.'

        // If this is not an axios error
        if (!axios.isAxiosError(error)) {
            console.error('Unexpected non-Axios error:', error)
            generalError.value = fallbackMessage;
            return
        }

        const status = error.response?.status
        const data = error.response?.data

        console.log('Backend error:', { status, data })

        // 422 Validation Errors (or login failure message)
        if (status === 422) {

            /**
             * Laravel validation errors (field-based)
             * If the backend sent validation errors and they are not empty, show them in the form
             * and stop here.
             */
            if (data?.errors && Object.keys(data.errors).length > 0) {
                backendErrors.value = data.errors as BackendError
                return
            }

            // Login failure or general message
            if (data?.message) {
                generalError.value = data.message as string
                return
            }

            generalError.value = fallbackMessage
            return
        }

        // Other unexpected backend/server errors
        console.error('Unexpected backend error:', error)
        generalError.value = fallbackMessage;
    }

    return {
        backendErrors,
        generalError,
        handleBackendErrors
    }
}


