/**
 * We format here the axios object, according to app needs.
 */


import router from '@/router/router';
import axios, { AxiosError } from 'axios';

//These two lines must be added to axios, otherwise the XSRF-TOKEN will not be sent to the server
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const appAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
    timeout: 10000,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

/**
 * Here we add a response interceptor to axios. This interceptor will be called every time a
 * response is received from the server. So here we made a global error handler for all requests.
 */
appAxios.interceptors.response.use(
    response => {
        return response;
    },

    (error: AxiosError) => {

        /**
         * Network error - no response from server
         */
        if (!error.response) {
            console.error('Network error or server unreachable')
            return Promise.reject(error)
        }

        const status = error.response?.status

        // Auth errors - redirect to login if not already there
        if (status === 401 || status === 419) {
            const currentRoute = router.currentRoute.value

            if (currentRoute.name !== 'login') {
                router.push({ name: 'login' })
                console.error('Authentication error, redirecting to login page.')
            }

            return Promise.reject(error)
        }

        // Everything else (500, 422, etc.)
        console.error(`API error with status ${status}`)
        return Promise.reject(error)
    }
);

export default appAxios;
