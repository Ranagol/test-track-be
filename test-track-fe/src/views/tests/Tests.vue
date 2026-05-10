<template>
    <div class="grid">
        <div class="h-16 flex">
            <h1 class="text-2xl mt-3">My tests</h1>
        </div>

        <div class="flex">

            <el-input
                style="width: 30%"
                placeholder="Search tests"
            />
            <el-button
                class="ml-3"
                type="primary"
            >
                Search
            </el-button>

            <el-button
                class="ml-3"
                type="primary"
            >
                Create new
            </el-button>
        </div>

        <!-- TABLE -->
        <div class="mt-3">
            <el-table
                :data="testsStore.tests"
                v-loading="testsStore.loading"
                style="width: 80%"
                :cell-style="{ verticalAlign: 'top' }"
            >
                <el-table-column
                    prop="title"
                    label="Title"
                ></el-table-column>

                <el-table-column
                    prop="test_code"
                    label="Test code"
                    width="150%"


                ></el-table-column>

                <el-table-column
                    prop="description"
                    label="Description"
                    min-width="250%"
                ></el-table-column>

                <el-table-column
                    prop="created_at"
                    label="Created"
                ></el-table-column>

                <el-table-column
                    prop=""
                    label="Actions"
                    min-width="120px"
                >
                    <template #default="scope">
                        <el-button
                            size="small"
                            type="primary"
                        >Edit</el-button>

                        <el-button
                            size="small"
                            type="danger"
                        >Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

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
