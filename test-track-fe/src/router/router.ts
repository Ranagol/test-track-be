import { createRouter, createWebHistory } from 'vue-router';
import Tests from '@/Tests.vue';
import Users from '@/Users.vue';

const routes = [
    {
        path: '/users',
        name: 'users',
        component: Users
    },
    {
        path: '/tests',
        name: 'tests',
        component: Tests
    }
];

const router = createRouter({

    /**
     * Here we set up history mode. This can either create web history or web hash history.
     * Web history will use real urls, when we navigate through pages. If we go to About page, the
     * url will be '/about'.
     * Web hash history will use # in url. If we go to About page, the url will be '/#/about'.
     */
    history: createWebHistory(),

    /**
     * This here is routes: routes.
     * The first routes is a property name.
     * The second routes is our routes object from above, that contains all the routes defined by us.
     */
    routes

});

/**
 * 5 step: here we export our router variable, so it can be imported on other pages too...
 */
export default router;

