import appAxios from './axiosService';
import type { LoginPayload } from '@/types/types';
import type { User } from '@/types/types';



/**
 * Laravel sends back two cookies: XSRF-TOKEN (readable by JS) and laravel_session (HTTP-only,
 * invisible to JS)
 * The browser stores them automatically in its cookie jar - no additional code is needed
 * On every subsequent request Axios reads XSRF-TOKEN from the cookie jar and sends it as the
 * X-XSRF-TOKEN header automatically — because withXSRFToken: true is set in the axios instance.
 */
export async function getCsrfCookie(): Promise<void> {
    await appAxios.get('/sanctum/csrf-cookie');
}

export async function login(payload: LoginPayload): Promise<void> {
    await getCsrfCookie();
    await appAxios.post('/login', payload);
}

export async function logout(): Promise<void> {
    await appAxios.post('/logout');
}

export async function fetchCurrentUser(): Promise<User> {
    const response = await appAxios.get<User>('api/user');
    return response.data;
}
