<template>
<div class="navbar">
    <!-- BRAND -->
    <router-link
        to="/"
        class="navbar-brand"
    >
        <el-icon class="navbar-brand-icon"><Ticket /></el-icon>
        <span class="navbar-brand-text">TestTrack</span>
    </router-link>

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
            index="/test-takers"
            v-if="authStore.user"
        >
            Test Takers
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

        <!-- LOGOUT -->
        <el-button
            v-if="authStore.user"
            id="logout-button"
            @click="logout"
            text
        >
            Logout
        </el-button>

        <!-- LOGIN -->
        <router-link
            v-if="!authStore.user"
            to="/login"
        >
            Login
        </router-link>

        <!-- REGISTER -->
        <!-- If the user has a test link, and no profile, and if he clicks on this Register item
         then the app will 'remember' the test link in the url, and redirect it there after a
         successful registration.
        query: Add query parameters to the URL. It will add this: '?redirect=/tests/take-test/TEST-0095-tk'

         -->
        <router-link
            v-if="!authStore.user"
            :to="{ name: 'register', query: { redirect: route.query.redirect } }"
        >
            Register
        </router-link>

    </div>
</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter, useRoute } from 'vue-router';
import { Ticket } from '@element-plus/icons-vue';

// Used for redirecting
const router = useRouter();

const route = useRoute();

const authStore = useAuthStore();

const logout = async () => {
    await authStore.signOut();
    router.push('/login');
};

</script>

<style scoped>

.navbar {
    display: flex;
    align-items: center;
    width: 100%;
    background: var(--color-bg);
    border-bottom: 1px solid var(--el-menu-border-color);
}

.navbar-brand {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 20px;
    font-size: 1.15rem;
    font-weight: 700;
    white-space: nowrap;
}

.navbar-brand-icon {
    color: var(--color-primary);
}

.navbar-brand-text {
    background: var(--gradient-brand);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
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
