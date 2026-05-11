<template>
    <Heading1
        :text="data.test.title ?? 'Test details'"
    />






    <DisplayBackendError
        :generalError="generalError"
    />


    {{ testsStore.test }}
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useApiErrors } from '@/composables/useApiErrors';
import { useRoute } from 'vue-router';
import type { Test } from '@/types/types';
import Heading1 from '@/resusableComponents/Heading1.vue';

const testsStore = useTestsStore();
const route = useRoute();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();

const testId = Number(route.params.id);


let data = reactive({
    test: {} as Test
});

onMounted(async () => {
    try {
        data.test = await testsStore.get(testId);
    } catch (error) {
        handleBackendErrors(error);
    }
});

</script>

<style scoped></style>
