import { createRouter, createWebHistory } from 'vue-router';
import Tests from '@/views/tests/list/Tests.vue';
import Login from '@/views/login/Login.vue';
import Register from '@/views/register/Register.vue';
import Home from '@/views/home/Home.vue';
import NotFound404 from '@/views/errors/NotFound404.vue';
import { useAuthStore } from '@/stores/useAuthStore';
import TestCreatePage from '@/views/tests/pages/TestCreatePage.vue';
import TestEditPage from '@/views/tests/pages/TestEditPage.vue';
import TestTakePage from '@/views/tests/pages/TestTakePage.vue';
import QuickStart from '@/views/quickStart/QuickStart.vue';
import Forbidden403 from '@/views/errors/Forbidden403.vue';
import SessionExpired419 from '@/views/errors/SessionExpired419.vue';
import TestTakers from '@/views/testTakers/TestTakers.vue';
import TestTakerDetails from '@/views/testTakers/TestTakerDetails.vue';

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
        name: 'testTakersList',
        component: TestTakers,
        meta: {
            // This page is only for logged-in users (protected page)
            requiresAuth: true
        }
    },
    {
        path: '/test-takers/:testTakerId',
        name: 'testTakerDetails',
        component: TestTakerDetails,
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
        path: '/tests/create',
        name: 'test-create',
        component: TestCreatePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/tests/:id/edit',
        name: 'test-edit',
        component: TestEditPage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/tests/take-test/:testCode',
        name: 'test-take',
        component: TestTakePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/quick-start',
        name: 'quick-start',
        component: QuickStart
    },
    {
        //SessionExprired419
        path: '/419',
        name: 'session-expired',
        component: SessionExpired419
    },
    {
        //Forbidden403
        path: '/403',
        name: 'forbidden',
        component: Forbidden403
    },
    {
        /**
         * NotFound404
         * Match anything that doesn't match the above routes and redirect to NotFound404
         * This must be the last route in the array.
         * '/:pathMatch(.*)*' is the new syntax for Vue Router 4 to catch all unmatched routes.
         */
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound404
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

    // Block auth pages for logged-in users
    if (to.meta.guestOnly && authStore.isAuthenticated) {
        return { name: 'home' };
    }

    /**
     * Block protected pages for guests AND remember where they originally wanted to go.
     * This is essential for cases when a test taker tries to access through received link his test,
     * that he must take. The link looks like this:
     * Example: /tests/take-test/TEST-4039-ms
     * If he clicks on the link, first he will be redirected to the /login page. But, thanks to this
     * setup, the login page link will look like this:
     * /login?redirect=/tests/take-test/TEST-4039-ms
     * Meaning: after succesfull login, the user will be redirected to the original page he wanted to
     * go. The app remembered where the test taker wanted to go
     */
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {

        return {
            name: 'login',
            query: {
                //fullPath is for example: /tests/take-test/TEST-4039-ms
                redirect: to.fullPath
            }
        };
    }

    // Otherwise allow navigation
    return true;
});

export default router;

