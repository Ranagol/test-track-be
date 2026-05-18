<template>
    <div class="grid">

        <div class="h-16 flex">
            <Heading1
                text="My test takers"
            />
        </div>

        <div
            class="flex"
        >

            <!-- SEARCH INPUT -->
            <!-- <el-input
                v-model="testsStore.searchTerm"
                style="width: 30%"
                placeholder="Search tests"
                clearable
                @keyup.enter="handleSearch"
                @clear="handleSearch"
                @input="handleSearch"
            /> -->

            <!-- SEARCH BUTTON -->
            <!-- <el-button
                class="ml-3"
                type="primary"
                @click="handleSearch"
            >
                Search
            </el-button> -->

            <!-- CREATE NEW BUTTON -->
            <!-- <el-button
                class="ml-3"
                type="primary"
            >
                Create new
            </el-button> -->
        </div>

        <!-- TABLE -->
        <div
            v-loading="testsStore.loading"
            class="mt-3"
        >
            <el-table
                :data="testsStore.tests"
                v-loading="testsStore.loading"
                style="width: 80%"
                :cell-style="{ verticalAlign: 'top' }"
                @sort-change="handleSort"
            >
                <!-- TITLE -->
                <el-table-column
                    prop="title"
                    label="Title"
                    sortable="custom"
                ></el-table-column>

                <!-- TEST CODE -->
                <el-table-column
                    prop="test_code"
                    label="Test code"
                    width="150%"
                    sortable="custom"
                ></el-table-column>

                <!-- DESCRIPTION -->
                <el-table-column
                    prop="description"
                    label="Description"
                    min-width="250%"
                    sortable="custom"
                ></el-table-column>

                <!-- CREATED -->
                <el-table-column
                    prop="created_at"
                    label="Created"
                    sortable="custom"
                ></el-table-column>


            </el-table>
        </div>

        <!-- PAGINATION -->
        <!-- <el-pagination
            v-model:current-page="testsStore.currentPage"
            v-model:page-size="testsStore.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="testsStore.pagination?.total || 0"
            @current-change="fetchTests"
            @size-change="fetchTests"
            class="mt-3"
        /> -->

        <DisplayBackendError
            :generalError="generalError"
        />

    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useApiErrors } from '@/composables/useApiErrors';
import type { TableSortData } from '@/types/types';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import Heading1 from '@/resusableComponents/Heading1.vue';

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
