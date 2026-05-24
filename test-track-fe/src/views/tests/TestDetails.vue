<template>

    <div v-if="testsStore.test">

        <!-- We use here testStore (and not data.test), because here we must collect the latest test data updates -->
        <el-input
            v-model="testsStore.test!.title"
            placeholder="Enter test title"
            style="font-size: 2rem;"
            @change="updateTest(testsStore.test!.id)"
        />

        <!-- We use here testStore (and not data.test), because here we must collect the latest test data updates -->
        <el-input
            v-model="testsStore.test!.description"
            type="textarea"
            placeholder="Enter test description"
            :rows="4"
            @change="updateTest(testsStore.test!.id)"
        />

    </div>

    <DisplayBackendError
        :generalError="generalError"
    />

</template>

<script
    setup
    lang="ts"
>
/**
 * This component is used to display the details of a test for test takers.
 * It will have 3 modes of working:
 * 1. Creating test by the tester           /tests/create → tester (create mode)
 * 2. Editing test by the tester            /tests/:id    → tester (edit mode)
 * 3. Taking the test by the test taker     /tests/take-test/:testCode → test taker (take mode)
 */
import { useTestsStore } from '@/stores/useTestsStore';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useApiErrors } from '@/composables/useApiErrors';
import { useRoute, useRouter } from 'vue-router';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import { ElMessage } from 'element-plus';

const testsStore = useTestsStore();
const testAttemptStore = useTestAttemptStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();

const props = defineProps<{

    mode: 'create' | 'edit' | 'take' | undefined;

}>();

const updateTest = async (testId: number) => {
    try {
        await testsStore.update(testId);
        ElMessage({
            message: 'Test updated successfully.',
            type: 'success',
        })
    } catch (error) {
        handleBackendErrors(error);
    }
}

</script>

<style scoped></style>
