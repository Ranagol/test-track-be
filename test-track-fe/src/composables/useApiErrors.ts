import { ref } from 'vue'
import type { BackendError } from '@/types/types';
import axios from 'axios';

/**
 * Composable for handling backend validation errors feedback in a Vue component.
 */
export function useApiErrors() {

    /**
     * Validation errors will be displayed in the label of the form field.
     */
    const validationErrors = ref<BackendError>({})

    /**
     * General errors will be displayed in DisplayBackendError.vue
     */
    const generalError = ref('')

    const handleBackendErrors = (error: unknown): void => {

        const fallbackMessage = 'An unexpected error occurred. Please try again later.'

        // Reset previous errors
        validationErrors.value = {}
        generalError.value = ''

        /**
         * At this moment, we do not know, if this error came from Axios, with known structure, or
         * it is some unexpected error (e.g. a JavaScript error in the code), with unknown structure,
         * that makes TS very unhappy.
         */
        if (!axios.isAxiosError(error)) {
            console.error('Unexpected non-Axios error:', error)
            generalError.value = fallbackMessage
            return
        }

        // NO INTERNET OR NO SERVER RESPONSE (from now on, we know this is an Axios error)
        if (!error.response) {
            console.log('Network/server error:', error)
            generalError.value = 'Unable to connect to the server.'
            return
        }

        const status = error.response.status
        const data = error.response.data


        // STATUS 401 or 419: Unauthorized or CSRF token mismatch (session expired)
        if (status === 401 || status === 419) {
            generalError.value = 'Your session has expired. Please log in again.'
            return
        }

        // STATUS 422: validation errors
        if (status === 422) {

            /**
             * Laravel validation errors (field-based)
             * If the backend sent validation errors and they are not empty, show them in the form
             * and stop here.
             */
            if (data?.errors && Object.keys(data.errors).length > 0) {
                validationErrors.value = data.errors as BackendError
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
        generalError.value = fallbackMessage;
    }

    return {
        validationErrors,
        generalError,
        handleBackendErrors
    }
}


