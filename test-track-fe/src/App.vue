<template>
    <div>
        <h1>Test Track Frontend</h1>
        <p v-if="loading">Loading...</p>
        <p v-else-if="isAuthenticated">Welcome, {{ user?.name }}!</p>
        <p v-else>Please log in.</p>
        <button @click="quickLogin" v-if="!isAuthenticated">Quick Login</button>
        <button @click="signOut" v-if="isAuthenticated">Sign Out</button>
    </div>
</template>


<script
    setup
    lang="ts"
>
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { user, isAuthenticated, loading, initAuth, signIn, signOut } = useAuth();

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
