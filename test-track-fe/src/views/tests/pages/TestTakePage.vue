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
import { useAuthStore } from '@/stores/useAuthStore';
import { useApiErrors } from '@/composables/useApiErrors';
import testAttemptService from '@/services/testAttemptService';
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { useRouter } from 'vue-router';
import { provide, ref, nextTick } from 'vue';

const route = useRoute();
const router = useRouter();
const testEditorStore = useTestEditorStore();
const testAttemptStore = useTestAttemptStore();
const authStore = useAuthStore();
const {
    generalError,
    validationErrors,
    handleBackendErrors
} = useApiErrors();



/**
 * Whether the test taker has selected an answer option for each question.
 */
const hasValidationError = ref(false);

/**
 * Used for triggering the validation in the AnswerOptionList component.
 */
const validationCycle = ref(0);

/**
 * This function will be provided/injected to the AnswerOptionList, so it can call it.
 */
const reportError = () => {
    hasValidationError.value = true;
};



/**
 * We provide the reportError() to the AnswerOptionList. This function can send back here a feedback
 * if our manual validation has found any validation errors.
 */
provide('reportError', reportError);

/**
 * We provide the validationCycle to the AnswerOptionList. It's purpose is to trigger the validation
 * in the AnswerOptionList, by changing its value. So, this is in the end a counter. We use a counter,
 * because we may need to trigger the validation multiple times. This can't be done with a boolean.
 */
provide('validationCycle', validationCycle);





/**
 * Used in test taking mode, for actually taking the test.
 */
const createTestAttempt = async () => {
    try {

        hasValidationError.value = false;//reset the validation error before validating the answer options, so that if the user has fixed the error, it will not be shown again.
        validationCycle.value++;//trigger the validation in the AnswerOptionList component, which will call the reportError() if there is a validation error (missing answer option selection for a question)
        await nextTick();//wait for the DOM to update after changing the validationCycle, so that the validation in the AnswerOptionList can run and report any errors.
        if (hasValidationError.value) {
            return; // STOP sending BE request if there is a validation error, the user needs to fix it first.
        }




        const test = testEditorStore.test;
        if (!test) return;

        const testAttempData = {
            test_id: test.id,
            user_id: authStore.userId,
        }

        const userAnswers = testAttemptStore.userAnswers;


        await testAttemptService.create(testAttempData, userAnswers);

        // Reset the test attempt data in the store
        testAttemptStore.resetTestAttempt();

        //Display feedback to the user about succesfully submitting the test
        ElMessageBox.alert(
            'You have successfully submitted the test. Have a nice day! ',
            'Confirmation', {
            confirmButtonText: 'OK',
            callback: (action: Action) => {
                if (action === 'confirm') {
                    // TODO ANDOR I temporarily disable this, uncomment later
                    // logout();
                }
            },
        })

        //TODO ANDOR Make sure that the user can not submit this test again, disable the submit button.

    } catch (error) {
        handleBackendErrors(error);
    }
}

onMounted( async() => {

    // Because the router path is named '/tests/take-test/:testCode'
    const testCode = route.params.testCode as string;

    // TODO ANDOR very likely we do not need the getByCode, unless the user can acces his test by code.
    await testEditorStore.getByCode(testCode);
});
</script>
