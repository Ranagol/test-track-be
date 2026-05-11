<template>
    <div class="grid">
        <div class="h-16 flex">
            <h1 class="text-2xl mt-3">My tests</h1>
        </div>

        <div class="flex">

            <!-- SEARCH INPUT -->
            <el-input
                v-model="testsStore.searchTerm"
                style="width: 30%"
                placeholder="Search tests"
                clearable
                @keyup.enter="handleSearch"
                @clear="handleSearch"
                @input="handleSearch"
            />

            <!-- SEARCH BUTTON -->
            <el-button
                class="ml-3"
                type="primary"
                @click="handleSearch"
            >
                Search
            </el-button>

            <!-- CREATE NEW BUTTON -->
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
                @sort-change="handleSort"
            >
                <el-table-column
                    prop="title"
                    label="Title"
                    sortable="custom"
                ></el-table-column>

                <el-table-column
                    prop="test_code"
                    label="Test code"
                    width="150%"
                    sortable="custom"
                ></el-table-column>

                <el-table-column
                    prop="description"
                    label="Description"
                    min-width="250%"
                    sortable="custom"
                ></el-table-column>

                <el-table-column
                    prop="created_at"
                    label="Created"
                    sortable="custom"
                ></el-table-column>

                <el-table-column
                    prop=""
                    label="Actions"
                    min-width="120px"
                >
                    <template #default="scope">

                        <!-- EDIT BUTTON -->
                        <el-button
                            size="small"
                            type="primary"
                        >Edit</el-button>

                        <!-- DELETE BUTTON -->
                        <el-button
                            size="small"
                            type="danger"
                        >Delete</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- PAGINATION -->
        <el-pagination
            v-model:current-page="testsStore.currentPage"
            v-model:page-size="testsStore.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="testsStore.pagination?.total || 0"
            @current-change="fetchTests"
            @size-change="fetchTests"
            class="mt-3"
        />

        <el-alert
            v-if="generalError"
            type="error"
            :title="generalError"
            show-icon
        />

    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useApiErrors } from '@/composables/useApiErrors';
import type { TableSortData } from '@/types/types';

const testsStore = useTestsStore();

const {
    generalError,
    handleBackendErrors
} = useApiErrors();

function handleSearch() {
    fetchTests();
}

function handleSort(sortData: TableSortData) {
    if (!sortData.prop) return;

    testsStore.sortBy = sortData.prop;

    /**
     * sortData.order can be 'ascending', 'descending'. We need to convert it to 'asc' or 'desc'
     * for the Laravel backend.
     */
    testsStore.sortOrder = sortData.order === 'ascending' ? 'asc' : 'desc';
    fetchTests();
}

async function fetchTests() {
    try {
        await testsStore.getAll();
    } catch (error) {
        handleBackendErrors(error);
    }
}

onMounted(() => {
    fetchTests();
});

</script>

<style scoped>

</style>
