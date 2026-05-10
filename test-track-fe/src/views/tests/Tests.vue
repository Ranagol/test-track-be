<template>
    <div>
        <h1>Tests</h1>
        <div
            v-for="test in testsStore.tests.data"
            :key="test.id"
        >
            {{ test.title }} - {{ test.description }}
        </div>

        <div
            v-if="testsStore.loading"
        >Loading...</div>
        <div
            v-if="generalError"
        >{{ generalError }}</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useBackendErrorHandling } from '@/composables/useBackendErrorHandling';

const testsStore = useTestsStore();
const {
    backendErrors,
    generalError,
    handleBackendErrors
} = useBackendErrorHandling();

onMounted(() => {
    console.log('Tests page mounted');
    testsStore.getAll();
    console.dir(testsStore.tests);
});
</script>

<style scoped>

</style>
