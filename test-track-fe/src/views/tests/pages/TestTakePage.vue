<template>
    <Container>

        <!-- THE TEST -->
        <TestBase
            mode="take"
        />

        <DisplayBackendError
            :generalError="generalError"
            :validationError="validationErrors.user_answers?.[0]"
        />

        <FinalButton
            buttonText="Submit test"
            buttonType="primary"
            @click="createTestAttempt"
        />

    </Container>

</template>

<script
    setup
    lang="ts"
>
import TestBase from '@/views/tests/test/TestBase.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import Container from '@/views/tests/test/Container.vue';
import FinalButton from '@/views/tests/test/FinalButton.vue';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useApiErrors } from '@/composables/useApiErrors';
import testAttemptService from '@/services/testAttemptService';
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { useRouter } from 'vue-router';
import { useAnswerOptionValidator } from '@/composables/validatorComposables/useAnswerOptionValidator';

const route = useRoute();
const router = useRouter();
const testEditorStore = useTestEditorStore();
const testAttemptStore = useTestAttemptStore();

const {
    generalError,
    validationErrors,
    handleBackendErrors
} = useApiErrors();

/**
 * This composable gives the possibility to stop the submission of the test attempt, if there are
 * validation errors in the answer options selection.
 */
const { validateSelectAnswerOptions } = useAnswerOptionValidator();


/**
 * Used in test taking mode, for actually taking the test.
 * In take mode there is no standard el-form validation check. Because there are only
 * answer option selections. And that is checked with the useAnswerOptionValidator/
 */
const createTestAttempt = async () => {
    try {

        // Validate answer option selection and stop if validation fails
        if (!(await validateSelectAnswerOptions())) {
            return;
        }

        // We do not validate the test form in take mode, there is no test form editing here.

        const test = testEditorStore.test;
        if (!test) return;

        const testAttemptData = {
            test_id: test.id,
        }

        const userAnswers = testAttemptStore.userAnswers;

        await testAttemptService.create(testAttemptData, userAnswers);



        //Display feedback to the user about succesfully submitting the test
        ElMessageBox.alert(
            'You have successfully submitted the test. Have a nice day! ',
            'Confirmation', {
            confirmButtonText: 'OK',
            callback: (action: Action) => {
                if (action === 'confirm') {
                    //redirect to the home page?
                    router.push('/');
                }
            },
        });

        // Reset the test attempt data in the store
        testAttemptStore.resetTestAttempt();

    } catch (error) {
        handleBackendErrors(error);
    }
}

onMounted( async() => {

    // Reset any previous test attempt before starting a new one.
    testAttemptStore.resetTestAttempt();

    // Because the router path is named '/tests/take-test/:testCode'
    const testCode = route.params.testCode as string;

    await testEditorStore.getByCode(testCode);
});

</script>

<style scoped>


</style>
