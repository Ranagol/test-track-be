<template>
    <h1>Home</h1>
    <h1 class="text-3xl font-bold underline">
        Hello world!
    </h1>

    <h1>Test Track Frontend</h1>
    <p v-if="authStore.loading">Loading...</p>
    <p v-else-if="authStore.isAuthenticated">Welcome, {{ authStore.user?.name }}!</p>
    <p v-else>Please log in.</p>
    <button @click="quickLogin" v-if="!authStore.isAuthenticated">Quick Login</button>
    <button @click="authStore.signOut" v-if="authStore.isAuthenticated">Sign Out</button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';

let authStore = useAuthStore();

async function quickLogin() {
    await authStore.signIn({
        email: 'tester@gmail.com',
        password: 'tester@gmail.com',
    });
}


</script>

<style scoped></style>
