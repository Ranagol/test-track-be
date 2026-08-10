<template>
<div class="navbar">
    <!-- MAIN NAVIGATION -->
    <el-menu
        mode="horizontal"
        :router="true"
        :ellipsis="false"
    >
        <el-menu-item
            index="/"
        >Home</el-menu-item>

        <el-menu-item
            index="/tests"
            v-if="authStore.user"
        >
            My Tests
        </el-menu-item>

        <el-menu-item
            index="/analytics"
            v-if="authStore.user"
        >
            Analytics
        </el-menu-item>

        <el-menu-item
            index="/quick-start"
        >Quick start</el-menu-item>

    </el-menu>

    <!-- ACCOUNT SECTION -->
    <div class="navbar-account">

        <span v-if="authStore.user">
            Hi, {{ authStore.user.email }}
        </span>

        <el-button
            v-if="authStore.user"
            id="logout-button"
            @click="logout"
            text
        >
            Logout
        </el-button>

        <router-link
            v-if="!authStore.user"
            to="/login"
        >
            Login
        </router-link>

        <router-link
            v-if="!authStore.user"
            to="/register"
        >
            Register
        </router-link>

    </div>
</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();
const logout = async () => {
    await authStore.signOut();
    router.push('/login');
};

</script>

<style scoped>

.navbar {
    display: flex;
    width: 100%;
    border-bottom: 1px solid var(--el-menu-border-color);
}

.navbar > .el-menu {
    border-bottom: none;
}

.navbar-account {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 20px;
}
</style>
