<template>

    <Container>

        <el-form
            ref="validationRef"
            :model="testEditorStore.test"
            :rules="testRules"
            :hide-required-asterisk="true"
            :scroll-to-error="true"
        >

            <Heading1
                text="Create test"
            />

            <!-- THE TEST -->
            <TestBase
                mode="create"
                :beValidationErrors="validationErrors"
            />

            <DisplayBackendError
                :generalError="generalError"
            />

            <FinalButton
                class="mt-4"
                buttonText="Create test"
                buttonType="primary"
                @click="createTest"
            />

        </el-form>

    </Container>

</template>

<script
    setup
    lang="ts"
>
import TestBase from '@/views/tests/test/TestBase.vue';
import { onMounted } from 'vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import Container from '@/views/tests/test/Container.vue';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import { useApiErrors } from '@/composables/useApiErrors';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import FinalButton from '@/views/tests/test/FinalButton.vue';
import Heading1 from '@/resusableComponents/Heading1.vue';
import  { testRules } from '@/validationRules/testRules';
import { useTestValidator } from '@/composables/useTestValidator';

const {
    generalError,
    handleBackendErrors,
    validationErrors
} = useApiErrors();

const { validateTest } = useTestValidator(validationErrors.value);

const testEditorStore = useTestEditorStore();
const router = useRouter();

const createTest = async () => {
    try {

        // Validate the test form
        if (!(await validateTest())) {
            return
        }

        await testEditorStore.create();
        ElMessage.success('Test created');
        router.push(`/tests`);
    } catch (e) {
        handleBackendErrors(e);
    }
};














onMounted(() => {
    testEditorStore.initializeNewTest();
});
</script>
