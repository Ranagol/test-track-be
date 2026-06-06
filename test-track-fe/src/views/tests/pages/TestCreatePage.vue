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
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

const {
    generalError,
    handleBackendErrors,
    validationErrors
} = useApiErrors();

const testEditorStore = useTestEditorStore();
const router = useRouter();

/**
 * Contains a reactive reference to the form, used for validation before test creation. So, thorugh
 * this, we can access title, description and all the questions and answer options, to validate them.
 */
const validationRef = ref<FormInstance>();

const createTest = async () => {
    try {



        // Reset all validation errors from BE.
        validationErrors.value = {}

        // Reset all validation errors on FE.
        validationRef.value?.clearValidate()

        if (!validationRef.value) {
            return
        }

        const valid = await validationRef.value.validate()

        if (!valid) {
            return
        }

        await testEditorStore.create();
        ElMessage.success('Test created');
        router.push(`/tests`);
    } catch (e) {
        console.error(e);
        console.dir(e);
        handleBackendErrors(e);
    }
};














onMounted(() => {
    testEditorStore.initializeNewTest();
});
</script>
