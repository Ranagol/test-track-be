<template>
    <div class="flex">
        <div
            v-if="authStore.user"
            class="mt-1"
        >Hi, {{ authStore.user.name }}</div>

        <el-button
            v-if="authStore.user"
            @click="logout"
            text
        >Logout</el-button>

        <el-button
            v-else
            @click="goToLoginPage"
            class="ml-auto"
            text
        >Login</el-button>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';

let authStore = useAuthStore();
let router = useRouter();


const logout = async () => {
    await authStore.signOut();
    goToLoginPage();
};

const goToLoginPage = () => {
    router.push('/login');
};
</script>

<style scoped></style>
