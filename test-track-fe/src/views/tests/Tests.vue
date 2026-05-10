<template>
    <div class="grid">
        <div class="h-16 flex">
            <h1 class="text-2xl mt-3">My tests</h1>
        </div>

        <div class="flex">

            <!-- SEARCH INPUT -->
            <el-input
                v-model="state.searchQuery"
                style="width: 30%"
                placeholder="Search tests"
                @keyup.enter="handleSearch"
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

        <div>
    Totalxx: {{ testsStore.pagination?.total }}
</div>

        <!-- PAGINATION -->
        <el-pagination
            v-model:current-page="state.currentPage"
            v-model:page-size="state.selectedItemsPerPage"
            layout="total, sizes, prev, pager, next, jumper"
            :total="testsStore.pagination?.total || 0"
            @current-change="handleCurrentPageChange"
            @size-change="handleSizeChange"
        />


    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useBackendErrorHandling } from '@/composables/useBackendErrorHandling';

const testsStore = useTestsStore();

const {
    backendErrors,
    generalError,
    handleBackendErrors
} = useBackendErrorHandling();

const state = reactive({

    // Searching stuff
    searchQuery: '',

    // Sorting stuff
    sortBy: 'title',
    sortOrder: 'asc' as 'asc' | 'desc',

    // Pagination stuff
    currentPage: 1,
    selectedItemsPerPage: 2,

});

function handleSearch() {
    fetchTests();
}

function handleSort(sortData: any) {
    if (!sortData.prop) return;

    state.sortBy = sortData.prop;
    state.sortOrder = sortData.order === 'ascending' ? 'asc' : 'desc';
    fetchTests();
}



function handleCurrentPageChange(page: number) {
    state.currentPage = page;
    fetchTests();
}

function handleSizeChange(size: number) {
    state.selectedItemsPerPage = size;
    state.currentPage = 1;
    fetchTests();
}

function fetchTests() {
    testsStore.getAll({
        // Searching parameters
        search: state.searchQuery,
        // Sorting parameters
        sort_by: state.sortBy,
        sort_order: state.sortOrder,
        // Pagination parameters
        page: state.currentPage,
        per_page: state.selectedItemsPerPage,
    });
}

onMounted(() => {
    fetchTests();
});
</script>

<style scoped>

</style>
