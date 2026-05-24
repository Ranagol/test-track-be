<template>

    <!-- TEST TAKING SUBMIT BUTTON -->
    <div class="flex flex-col items-end">

        <!-- SUBMIT -->
        <el-button
            @click="createTestAttempt()"
            class="mt-6"
            type="primary"
        >
            Submit Test
        </el-button>
    </div>

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
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTestsStore } from '@/stores/useTestsStore';
import { useApiErrors } from '@/composables/useApiErrors';
import type { Test } from '@/types/types';
import testAttemptService from '@/services/testAttemptService';
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { reactive } from 'vue';

const testAttemptStore = useTestAttemptStore();
const authStore = useAuthStore();
const testsStore = useTestsStore();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();

/**
 * Used in test taking mode, for actually taking the test.
 */
const createTestAttempt = async () => {
    try {

        const testAttempData = {
            test_id: testsStore.test!.id,
            user_id: authStore.userId,
        }

        const userAnswers = testAttemptStore.userAnswers;

        console.log('testAttempData:', testAttempData)
        console.log('userAnswers:', userAnswers)
        await testAttemptService.create(testAttempData, userAnswers);

        // Reset the test attempt data in the store
        testAttemptStore.resetTestAttempt();

        //Display feedback to the user about succesfully submitting the test
        ElMessageBox.alert(
            'You have successfully submitted the test. You will be now signed out. Have a nice day! ',
            'Confirmation', {
            confirmButtonText: 'OK',
            callback: (action: Action) => {
                if (action === 'confirm') {
                    // TODO ANDOR I temporarily disable this, uncomment later
                    // logout();
                }
            },
        })


        //TODO ANDOR Make sure that the user can not submit this test again.

    } catch (error) {
        // TODO ANDOR why this was not triggered when the test_id was missing from the request?
        handleBackendErrors(error);
    }
}









</script>

<style scoped></style>
