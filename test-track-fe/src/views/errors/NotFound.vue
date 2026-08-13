<template>
    <div class="error-container flex items-center justify-center">
        <div class="error-content mx-auto mt-18 text-center">
            <el-icon class="error-icon"><WarningFilled /></el-icon>
            <div class="error-code text-6xl">404</div>
            <h1 class="error-title text-2xl">Page Not Found</h1>
            <p class="error-description">
                Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <div class="error-actions mt-5">
                <el-button type="primary" @click="goHome">
                    Go to Home
                </el-button>
                <el-button @click="goBack">
                    Go Back
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { WarningFilled } from '@element-plus/icons-vue';

const router = useRouter();

const goHome = () => {
    router.push('/');
};

const goBack = () => {
    router.back();
};
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
