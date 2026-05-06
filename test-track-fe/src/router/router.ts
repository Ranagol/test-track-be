import { createRouter, createWebHistory } from 'vue-router';
import Tests from '@/views/tests/Tests.vue';
import Users from '@/views/users/Users.vue';
import Login from '@/views/login/Login.vue';
import Register from '@/views/register/Register.vue';
import Home from '@/views/home/Home.vue';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/',
        name: 'home',
        component: Home
    },
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

const router = createRouter({history: createWebHistory(), routes});

export default router;

