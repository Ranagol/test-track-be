<template>

    <div v-if="testEditorStore.test">

        <el-input
            v-model="testEditorStore.test.title"
            placeholder="Enter test title"
            style="font-size: 2rem;"
            @change="updateTest()"
        />

        <el-input
            v-model="testEditorStore.test.description"
            type="textarea"
            placeholder="Enter test description"
            :rows="4"
            @change="updateTest()"
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
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import { useApiErrors } from '@/composables/useApiErrors';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import { ElMessage } from 'element-plus';

const testEditorStore = useTestEditorStore();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();

const props = defineProps<{

    mode: 'create' | 'edit' | 'take';

}>();

const updateTest = async () => {
    try {
        const test = testEditorStore.test;
        if (!test) return;

        await testEditorStore.update(test.id);
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
