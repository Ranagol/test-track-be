<template>
    <h1>TestEdit</h1>
    {{ testsStore.test }}
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useApiErrors } from '@/composables/useApiErrors';
import { useRoute } from 'vue-router';

const testsStore = useTestsStore();

const route = useRoute();
const testId = Number(route.params.id);

onMounted(() => {
    testsStore.get(testId)
});

</script>

<style scoped></style>
