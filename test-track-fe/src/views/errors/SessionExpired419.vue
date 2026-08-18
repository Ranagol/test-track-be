<template>
    <div class="error-container flex items-center justify-center">
        <div class="error-content mx-auto mt-18 text-center">
            <el-icon class="error-icon"><Lock /></el-icon>
            <div class="error-code text-6xl">419</div>
            <h1 class="error-title text-2xl">Session Expired</h1>
            <p class="error-description">
                Your session has expired. Please log in again to continue.
            </p>
            <div class="error-actions mt-5">
                <el-button type="primary" @click="login">
                    Log in again
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Lock } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

const login = () => {
    router.push('/login');
};

onMounted(() => {
    authStore.clearAuth();
});
</script>



<style scoped>

.error-icon {
    font-size: 3rem;
    color: var(--color-warning);
}

.error-code {
    font-weight: 700;
    background: var(--gradient-brand);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.error-description {
    color: var(--color-text-soft);
}

</style>
