<template>
    <div>
        <h1>Tests</h1>

        <el-table
            :data="testsStore.tests"
            v-loading="testsStore.loading"
        >
            <el-table-column
                prop="title"
                label="Title"
            ></el-table-column>
            <el-table-column
                prop="description"
                label="Description"
            ></el-table-column>
        </el-table>


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
