import { createRouter, createWebHistory } from 'vue-router';
import Tests from '@/views/tests/Tests.vue';
import TestTakers from '@/views/users/TestTakers.vue';
import Login from '@/views/login/Login.vue';
import Register from '@/views/register/Register.vue';
import Home from '@/views/home/Home.vue';
import NotFound from '@/views/errors/NotFound.vue';
import { useAuthStore } from '@/stores/useAuthStore';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        /**
         * meta is extra information attached to the route. Vue Router does not use it. We use it.
         */
        meta: {
            //This page is only for users who are NOT logged in (guests)
            guestOnly: true
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            guestOnly: true
        }
    },
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/test-takers',
        name: 'test-takers',
        component: TestTakers,
        meta: {
            // This page is only for logged-in users (protected page)
            requiresAuth: true
        }
    },
    {
        path: '/tests',
        name: 'tests',
        component: Tests,
        meta: {
            requiresAuth: true
        }
    },
    {
        /**
         * Match anything that doesn't match the above routes and redirect to NotFound
         * This must be the last route in the array.
         * '/:pathMatch(.*)*' is the new syntax for Vue Router 4 to catch all unmatched routes.
         */
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    }
];

const router = createRouter({history: createWebHistory(), routes});

/**
 * Global route guard.
 * Run this before each route change.
 * to is the destination route object, where we want to go.
 */
router.beforeEach(async (to) => {

    /**
     * This must be inside the beforeEach, because we need to access the authStore.
     */
    const authStore = useAuthStore();

    // Make sure user is loaded once (important after refresh)
    if (!authStore.initialized) {
        try {
            await authStore.getCurrentUser();
        } catch (e) {
            // ignore - store already sets user = null
        }
    }

    // 🚫 Block auth pages for logged-in users
    if (to.meta.guestOnly && authStore.isAuthenticated) {//what is to?
        return { name: 'home' };
    }

    // 🔐 Block protected pages for guests
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: 'login' };
    }
});

export default router;

