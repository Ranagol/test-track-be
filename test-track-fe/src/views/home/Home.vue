<template>
    <h1>Home</h1>
    <h1 class="text-3xl font-bold underline">
        Hello world!
    </h1>
    <h3>{{ testStore.message }}</h3>

    <h1>Test Track Frontend</h1>
    <p v-if="loading">Loading...</p>
    <p v-else-if="isAuthenticated">Welcome, {{ user?.name }}!</p>
    <p v-else>Please log in.</p>
    <button @click="quickLogin" v-if="!isAuthenticated">Quick Login</button>
    <button @click="signOut" v-if="isAuthenticated">Sign Out</button>
</template>

<script setup lang="ts">
import { useTestStore } from '@/stores/tests';
import { onMounted, ref } from 'vue';
import { useAuth } from '@/composables/useAuth';


const { user, isAuthenticated, loading, initAuth, signIn, signOut } = useAuth();
const testStore = useTestStore();





onMounted(async () => {
    await initAuth();
});

async function quickLogin() {
    await signIn({
        email: 'tester@gmail.com',
        password: 'tester@gmail.com',
    });
}


</script>

<style scoped></style>
