import appAxios from './axiosService';

export interface LoginPayload {
    email: string;
    password: string;
    remember?: boolean;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role?: string;
}

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

export async function fetchCurrentUser(): Promise<AuthUser> {
    const response = await appAxios.get<AuthUser>('api/user');
    return response.data;
}
