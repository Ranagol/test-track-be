<template>

    <!-- THIS IS ACTUALLY THE ANALYTICS PAGE MAIN COMPONENT -->
    <div class="grid">

        <div class="h-16 flex">
            <Heading1
                text="My test takers (analytics)"
            />
        </div>

        <p class="mt-3 mb-1">We display here all test attempts for all your test takers.</p>

        <div class="flex">

            <!-- SEARCH INPUT -->
            <el-input
                v-model="testAttemptStore.searchTerm"
                style="width: 40%"
                placeholder="Search for test taker name or test name"
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
                stripe
                @sort-change="handleSort"
            >
                <!-- TEST TAKER NAME -->
                <el-table-column
                    prop="user.name"
                    label="Test taker"
                    v-slot="{ row }"
                >
                    <router-link
                        :to="`/analytics/${row.user.id}`"
                        class="text-primary underline"
                    >
                        {{ row.user.name }}
                    </router-link>
                </el-table-column>

                <!-- TEST NAME -->
                <el-table-column
                    prop="test.title"
                    label="Test name"
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
                    v-slot="{ row }"
                >
                    <el-tag
                        v-if="row.score_percentage != null"
                        :type="scoreTagType(row.score_percentage)"
                        effect="light"
                    >
                        {{ row.score_percentage }}%
                    </el-tag>
                </el-table-column>


            </el-table>
        </div>

        <!-- PAGINATION -->
        <el-pagination
            v-model:current-page="testAttemptStore.currentPage"
            v-model:page-size="testAttemptStore.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="testAttemptStore.pagination?.total || 0"
            @current-change="fetchTestAttempts"
            @size-change="fetchTestAttempts"
            class="mt-3"
        />

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
    fetchTestAttempts();
}

/**
 * Maps a score percentage to an el-tag type so pass/fail is visible at a glance.
 */
function scoreTagType(score: number): 'success' | 'warning' | 'danger' {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
}

function handleSort(sortData: TableSortData) {
    if (!sortData.prop) return;

    // el-table here tells us which column to use for sorting
    testAttemptStore.sortBy = sortData.prop;

    /**
     * el-table here tells us the order of sorting
     * sortData.order can be 'ascending', 'descending'. We need to convert it to 'asc' or 'desc'
     * for the Laravel backend.
     */
    testAttemptStore.sortOrder = sortData.order === 'ascending' ? 'asc' : 'desc';
    fetchTestAttempts();
}

async function fetchTestAttempts() {
    try {
        await testAttemptStore.getAll();
    } catch (error) {
        handleBackendErrors(error);
    }
}

onMounted(() => {
    fetchTestAttempts();
});

</script>

<style scoped>

</style>
