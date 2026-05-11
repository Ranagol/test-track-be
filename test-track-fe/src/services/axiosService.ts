/**
 * We format here the axios object, according to app needs.
 */
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
        }

        return Promise.reject(error)
    }
);

export default appAxios;
