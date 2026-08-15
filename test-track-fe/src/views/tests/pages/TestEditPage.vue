<template>
    <Container>

        <el-form
            v-loading="testEditorStore.loading"
            ref="validationRef"
            :model="testEditorStore.test"
            :rules="testRules"
            :hide-required-asterisk="true"
            :scroll-to-error="true"
        >

            <Heading1
                text="Edit test"
            />

            <InvitationLink />

            <!-- THE TEST -->
            <TestBase
                mode="edit"
            />

            <DisplayBackendError
                :generalError="generalError"
            />

            <FinalButton
                class="mt-4"
                buttonText="Update test"
                buttonType="primary"
                @click="updateTest"
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
import { useRoute, useRouter } from 'vue-router';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import FinalButton from '@/views/tests/test/FinalButton.vue';
import Heading1 from '@/resusableComponents/Heading1.vue';
import { useApiErrors } from '@/composables/useApiErrors';
import { ElMessage } from 'element-plus';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import Container from '@/views/tests/test/Container.vue';
import  { testRules } from '@/validationRules/testRules';
import { useTestValidator } from '@/composables/validatorComposables/useTestValidator';
import { useAnswerOptionValidator } from '@/composables/validatorComposables/useAnswerOptionValidator';
import type { FormInstance } from 'element-plus';
import InvitationLink from '@/views/tests/test/InvitationLink.vue';

const {
    generalError,
    handleBackendErrors,
    validationErrors,
    getStatusCode
} = useApiErrors();

const route = useRoute();
const router = useRouter();
const testEditorStore = useTestEditorStore();

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

const updateTest = async () => {
    try {

        // // Validate answer option selection and stop if validation fails
        if (!(await validateSelectAnswerOptions())) {
            return;
        }

        // Validate the test form
        if (!(await validateTest())) {
            return
        }

        await testEditorStore.update();
        ElMessage.success('Test updated');
    } catch (e) {
        handleBackendErrors(e);
    }
};

onMounted(async () => {
    const id = Number(route.params.id);

    try {
        await testEditorStore.get(id);
    } catch (error) {
        handleBackendErrors(error);

        // If the user is not authorized to view the test, navigate to the 403 page
        if (getStatusCode(error) === 403) {
            // navigate to /403
            router.push({ name: 'forbidden' })
        }
    }
});

</script>
