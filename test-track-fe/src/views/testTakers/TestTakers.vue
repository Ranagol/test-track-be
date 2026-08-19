<template>

    <div class="grid">

        <div class="h-16 flex">
            <Heading1
                text="My test takers (analytics)"
            />
        </div>

        <div class="flex">

            <!-- SEARCH INPUT -->
            <el-input
                v-model="testTakerStore.searchTerm"
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
            v-loading="testTakerStore.loading"
            class="mt-3"
        >
            <el-table
                :data="testTakerStore.testTakers"
                v-loading="testTakerStore.loading"
                :cell-style="{ verticalAlign: 'top' }"
                stripe
                @sort-change="handleSort"
            >
                <!-- TEST TAKER NAME -->
                <el-table-column
                    prop="name"
                    label="Test taker"
                    v-slot="{ row }"
                >
                    <!-- <router-link
                        :to="`/analytics/${row.id}`"
                        class="text-primary underline"
                    >
                        {{ row.user.name }}
                    </router-link> -->
                </el-table-column>

                <!-- EMAIL -->
                <el-table-column
                    prop="email"
                    label="Email"
                ></el-table-column>

                <!-- NUMBER OF TESTS -->
                <el-table-column
                    prop="tests"
                    label="Number of tests"
                ></el-table-column>

                <!-- NUMBER OF TEST ATTEMPTS -->
                <el-table-column
                    prop="test_attempts"
                    label="Number of test attempts"
                    sortable="custom"
                ></el-table-column>

                <!-- DATE OF LAST TEST ATTEMPT -->
                <el-table-column
                    prop="last_test_attempt"
                    label="Date of last test attempt"
                    sortable="custom"
                ></el-table-column>

            </el-table>
        </div>

        <!-- PAGINATION -->
        <el-pagination
            v-model:current-page="testTakerStore.currentPage"
            v-model:page-size="testTakerStore.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="testTakerStore.pagination?.total || 0"
            @current-change="fetchTestTakers"
            @size-change="fetchTestTakers"
            class="mt-3"
        />

        <DisplayBackendError
            :generalError="generalError"
        />

    </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTestTakerStore } from '@/stores/useTestTakerStore'
import { useApiErrors } from '@/composables/useApiErrors';
import type { TableSortData } from '@/types/types';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import Heading1 from '@/resusableComponents/Heading1.vue';
import type { TestTaker, PaginationMeta, PaginationLinks } from '@/types/types';

const testTakerStore = useTestTakerStore();

const {
    generalError,
    handleBackendErrors
} = useApiErrors();


const handleSearch = () => {
    fetchTestTakers();
};

const handleSort = (sortData: TableSortData) => {
    if (!sortData.prop) return;

    // el-table here tells us which column to use for sorting
    testTakerStore.sortBy = sortData.prop;

    /**
     * el-table here tells us the order of sorting
     * sortData.order can be 'ascending', 'descending'. We need to convert it to 'asc' or 'desc'
     * for the Laravel backend.
     */
    testTakerStore.sortOrder = sortData.order === 'ascending' ? 'asc' : 'desc';
    fetchTestTakers();
};

async function fetchTestTakers() {
    try {
        await testTakerStore.getAll();
    } catch (error) {
        handleBackendErrors(error);
    }
}

onMounted(async () => {
    await fetchTestTakers();
});

</script>
