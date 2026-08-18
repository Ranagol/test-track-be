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

            <ul class="mt-4 list-disc list-inside text-gray-700">
                <li>
                    Create a new test by filling in the title, description, questions and answer options.
                </li>
                <li>
                    For every question, you must create at least two answer options.
                </li>
                <li>
                    You must also select the correct answer option for each question.
                </li>
                <li>
                    You can create as many questions and answer options as you want.
                </li>
                <li>
                    Once you are done, click on the "Create test" button to create the test.
                </li>
            </ul>

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
import { onMounted, ref } from 'vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import Container from '@/views/tests/test/Container.vue';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import { useApiErrors } from '@/composables/useApiErrors';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import FinalButton from '@/views/tests/test/FinalButton.vue';
import Heading1 from '@/resusableComponents/Heading1.vue';
import  { testRules } from '@/validationRules/testRules';
import { useTestValidator } from '@/composables/validatorComposables/useTestValidator';
import { useAnswerOptionValidator } from '@/composables/validatorComposables/useAnswerOptionValidator';
import type { FormInstance } from 'element-plus';

const {
    generalError,
    handleBackendErrors,
    validationErrors
} = useApiErrors();

const testEditorStore = useTestEditorStore();
const router = useRouter();

/**
 * Validates the test form on FE. All, except the answer option selection.
 * Contains a reactive reference to the form, used for validation before test creation. So, thorugh
 * this, we can access title, description and all the questions and answer options, to validate them.
 */
const validationRef = ref<FormInstance>();

/**
 * Composable that executes the regular FE validation for all forms in el-form (except the validation
 * of answer option selection))
 */
const { validateTest } = useTestValidator(
    validationRef,
    validationErrors.value
);

/**
 * Composable the does the validation of the answer option selection.
 */
const { validateSelectAnswerOptions } = useAnswerOptionValidator();

const successMessage = 'Test created! You can now invite your test takers, by sharing the link of the test. Click on the Copy button to copy the link to your clipboard.';

const createTest = async () => {
    try {

        // Validate answer option selection and stop if validation fails
        if (!(await validateSelectAnswerOptions())) {
            ElMessage.error({
                message: 'Please select the correct answer option for each question.',
                duration: 5000,
            });
            return;
        }

        // Validate the test form
        if (!(await validateTest())) {
            ElMessage.error({
                message: 'Please fill in all required fields.',
                duration: 5000,
            });
            return
        }

        await testEditorStore.create();
        ElMessage.success({
            message: successMessage,
            duration: 5000,
        });
        router.push(`/tests`);
    } catch (e) {
        handleBackendErrors(e);
    }
};

onMounted(() => {
    testEditorStore.initializeNewTest();
});
</script>
