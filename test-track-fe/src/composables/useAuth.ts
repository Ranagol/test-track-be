import { computed, ref } from 'vue';
import { fetchCurrentUser, login, logout, type AuthUser, type LoginPayload } from '@/services/authService';

const user = ref<AuthUser | null>(null);
const loading = ref(false);
const initialized = ref(false);

const isAuthenticated = computed(() => user.value !== null);

async function initAuth(): Promise<void> {
    if (initialized.value) {
        return;
    }

    loading.value = true;
    try {
        user.value = await fetchCurrentUser();
    } catch {
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

export function useAuth() {
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
