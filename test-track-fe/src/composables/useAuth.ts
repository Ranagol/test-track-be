import { computed, ref } from 'vue';
import { fetchCurrentUser, login, logout, type AuthUser, type LoginPayload } from '@/services/authService';

export function useAuth() {

    //"data()"
    const user = ref<AuthUser | null>(null);
    const loading = ref(false);
    // Needed to prevent multiple calls to fetchCurrentUser()
    const initialized = ref(false);

    const isAuthenticated = computed(() => user.value !== null);

    /**
     * Fetches the current logged in user from the backend
     * Promise<void> means: This function runs asynchronously, but when it finishes, it does NOT
     * return any data.
     */
    async function initAuth(): Promise<void> {

        // If const initialized is true, return.
        if (initialized.value) {
            return;
        }

        loading.value = true;

        try {
            user.value = await fetchCurrentUser();
        } catch {
            // If the request fails, we assume the user is not authenticated. So we set user to null.
            // Error is handled globally in axios interceptor, so we don't need to do anything here.
            user.value = null;
        } finally {
            initialized.value = true;
            loading.value = false;
        }
    }

    async function signIn(payload: LoginPayload): Promise<void> {
        loading.value = true;
        try {
            await login(payload);
            user.value = await fetchCurrentUser();
        } finally {
            loading.value = false;
        }
    }

    async function signOut(): Promise<void> {
        loading.value = true;
        try {
            await logout();
            user.value = null;
        } finally {
            loading.value = false;
        }
    }

    return {
        user,
        loading,
        initialized,
        isAuthenticated,
        initAuth,
        signIn,
        signOut,
    };
}
