import { defineStore } from 'pinia'
import type { LoginPayload } from '@/types/types';
import type { User } from '@/types/types';
import { fetchCurrentUser, login, logout } from '@/services/authService';

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: null as null | User,
        loading: false as boolean,
        initialized: false as boolean
    }),

    getters: {

        /**
         * User exists → returns true
         * User is null → returns false
         * @param state
         * @returns
         */
        isAuthenticated: (state) => !!state.user
    },

    actions: {

        /**
         * Fetches the current logged in user from the backend
         * Promise<void> means: This function runs asynchronously, but when it finishes, it does NOT
         * return any data.
         */
        async getCurrentUser(): Promise<void> {

            // If const initialized is true, return.
            if (this.initialized) {
                return;
            }

            this.loading = true;

            try {
                this.user = await fetchCurrentUser();
            } catch {
                // If the request fails, we assume the user is not authenticated. So we set user to null.
                // Error is handled globally in axios interceptor, so we don't need to do anything here.
                this.user = null;
            } finally {
                this.initialized = true;
                this.loading = false;
            }
        },

        async signIn(payload: LoginPayload): Promise<void> {
            this.loading = true;
            try {
                await login(payload);
                this.user = await fetchCurrentUser();
            } finally {
                this.loading = false;
            }
        },

        async signOut(): Promise<void> {
            this.loading = true;
            try {
                await logout();
                this.user = null;
            } finally {
                this.loading = false;
            }
        }
    }
})
