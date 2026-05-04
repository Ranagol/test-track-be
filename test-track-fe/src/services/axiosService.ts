// import router from '@/router';//TODO ANDOR router must be set up here later
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
    withCredentials: true,
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
        // If the request was successful, just return/give the response to Vue components
        return response;
    },

    // If the request failed, handle the error
    (error: AxiosError) => {

        if (error.response?.status === 401 || error.response?.status === 419) {
            // session expired — redirect to login
            // user.value = null; // if using useAuth composable
            // router.push({ name: 'login' });
        }
        console.error('An error occurred - interceptor -:', error);
        // router.push({ name: 'error' });//TODO ANDOR make this error page later
        return Promise.reject(error);
    }
);

export default appAxios;
