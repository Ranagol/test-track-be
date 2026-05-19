<template>
    <div class="grid">

        <div class="h-16 flex">
            <Heading1
                text="My analytics"
            />
        </div>

        <div
            class="flex"
        >

            <!-- SEARCH INPUT -->
            <el-input
                v-model="testAttemptStore.searchTerm"
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

        </div>

        <!-- TABLE -->
        <div
            v-loading="testAttemptStore.loading"
            class="mt-3"
        >
            <el-table
                :data="testAttemptStore.testAttempts"
                v-loading="testAttemptStore.loading"
                :cell-style="{ verticalAlign: 'top' }"
                @sort-change="handleSort"
            >
                <!-- TEST TAKER NAME -->
                <el-table-column
                    prop="user.name"
                    label="Test taker"
                    sortable="custom"
                ></el-table-column>

                <!-- TEST NAME -->
                <el-table-column
                    prop="test.title"
                    label="Test name"
                    sortable="custom"
                ></el-table-column>

                <!-- TEST DESCRIPTION -->
                <el-table-column
                    prop="test.description"
                    label="Test description"
                ></el-table-column>

                <!-- TAKEN AT -->
                <el-table-column
                    prop="created_at"
                    label="Test attempt date"
                    sortable="custom"
                ></el-table-column>

                <!-- SCORE -->
                <el-table-column
                    prop="score_percentage"
                    label="Score (%)"
                    sortable="custom"
                ></el-table-column>


            </el-table>
        </div>

        <!-- PAGINATION -->
        <!-- <el-pagination
            v-model:current-page="testAttemptStore.currentPage"
            v-model:page-size="testAttemptStore.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="testAttemptStore.pagination?.total || 0"
            @current-change="fetchAnalytics"
            @size-change="fetchAnalytics"
            class="mt-3"
        /> -->

        <pre>
        {{ testAttemptStore.testAttempts }}
        </pre>

        <DisplayBackendError
            :generalError="generalError"
        />

    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useApiErrors } from '@/composables/useApiErrors';
import type { TableSortData } from '@/types/types';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import Heading1 from '@/resusableComponents/Heading1.vue';

const testAttemptStore = useTestAttemptStore();

const {
    generalError,
    handleBackendErrors
} = useApiErrors();

function handleSearch() {
    fetchAnalytics();
}

function handleSort(sortData: TableSortData) {
    if (!sortData.prop) return;

    testAttemptStore.sortBy = sortData.prop;

    /**
     * sortData.order can be 'ascending', 'descending'. We need to convert it to 'asc' or 'desc'
     * for the Laravel backend.
     */
    testAttemptStore.sortOrder = sortData.order === 'ascending' ? 'asc' : 'desc';
    fetchAnalytics();
}

async function fetchAnalytics() {
    try {
        await testAttemptStore.getAll();
    } catch (error) {
        handleBackendErrors(error);
    }
}

onMounted(() => {
    fetchAnalytics();
});

</script>

<style scoped>

</style>
