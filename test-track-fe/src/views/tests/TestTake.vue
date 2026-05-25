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

import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useApiErrors } from '@/composables/useApiErrors';
import testAttemptService from '@/services/testAttemptService';
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { useTestEditorStore } from '@/stores/testEditorStore';
import { useRouter } from 'vue-router';

const testAttemptStore = useTestAttemptStore();
const authStore = useAuthStore();
const testEditorStore = useTestEditorStore();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();
const router = useRouter();

const logout = async () => {
    await authStore.signOut();
    router.push('/login');
};

/**
 * Used in test taking mode, for actually taking the test.
 */
const createTestAttempt = async () => {
    try {
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
