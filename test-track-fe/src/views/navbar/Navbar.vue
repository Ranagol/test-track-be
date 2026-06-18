<template>
    <!-- //TODO ANDOR how to make these colors dynamic, connect with main.css variables -->
    <el-menu
        class="el-menu-demo"
        mode="horizontal"
        router
    >
        <el-menu-item index="/">Home</el-menu-item>
        <el-menu-item index="/tests">My tests</el-menu-item>
        <el-menu-item index="/analytics">Analytics</el-menu-item>

        <!-- LOGIN -->
        <el-menu-item
            index="/login"
            v-if="!authStore.user"
        >Login</el-menu-item>

        <!-- REGISTER -->
        <el-menu-item
            index="/register"
            v-if="!authStore.user"
        >Register</el-menu-item>

        <!-- LOGOUT -->
        <el-menu-item
            index=""
            v-if="authStore.user"
        >
            <el-button
                id="logout-button"
                @click="logout"
                text
            >Logout</el-button>
        </el-menu-item>

        <!-- HI, USER -->
        <el-menu-item
            index=""
            v-if="authStore.user"
        >Hi, {{ authStore.user.name }}</el-menu-item>

    </el-menu>
</template>

<script setup lang="ts">
// import Logout from '@/views/navbar/Logout.vue';
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

/* Set the height of the horizontal navigation menu */
.el-menu--horizontal {
  --el-menu-horizontal-height: 1.9rem;
  display: flex;
  flex-wrap: nowrap;
  overflow: visible;
}

/* In the navbar, the first 5 elements should be on left. All others on right. */
</style>
