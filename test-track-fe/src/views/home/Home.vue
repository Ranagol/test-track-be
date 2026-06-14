<template>
    <h1>Home</h1>
    <h1 class="text-3xl font-bold underline">
        Welcome to Test Track!
    </h1>

    <el-form
        class="mt-3"
        label-position="top"
        style="width: 33%"
    >
        <el-form-item
            label="Please type in your test code to start the test"
        >
            <el-input
                placeholder="Test code"
                v-model="data.testCode"
            />
        </el-form-item>

    </el-form>

    <h1>Dummy login for quick testing</h1>
    <div>
        <p v-if="authStore.loading">Loading...</p>
        <p v-else-if="authStore.isAuthenticated">Welcome, {{ authStore.user?.name }}!</p>
        <p v-else>Please log in.</p>
        <button @click="quickLogin" v-if="!authStore.isAuthenticated">Quick Login</button>
        <button @click="authStore.signOut" v-if="authStore.isAuthenticated">Sign Out</button>
    </div>

</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { reactive } from 'vue';


let data = reactive({
    testCode: '',
});

let authStore = useAuthStore();

async function quickLogin() {
    await authStore.signIn({
        email: 'tester@gmail.com',
        password: 'tester@gmail.com',
    });
}


</script>

<style scoped></style>
