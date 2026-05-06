<template>
    <div class="error-container flex items-center justify-center">
        <div class="error-content mx-auto mt-18 text-center">
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

const router = useRouter();

const goHome = () => {
    router.push('/');
};

const goBack = () => {
    router.back();
};
</script>

<style scoped>

</style>
