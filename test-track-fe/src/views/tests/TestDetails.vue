<template>
    <Heading1 :text="'Test: ' + (data.test.title ?? 'Test details')" />

    <QuestionList :questions="data.test.questions || []" />

    <DisplayBackendError :generalError="generalError" />

    <div class="flex flex-col items-end">
        <!-- SUBMIT -->
        <el-button class="mt-6" type="primary" @click="createTestAttempt()">
            Submit Test
        </el-button>
    </div>

</template>

<script
    setup
    lang="ts"
>
import { onMounted, reactive } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useApiErrors } from '@/composables/useApiErrors';
import { useRoute, useRouter } from 'vue-router';
import type { Test } from '@/types/types';
import Heading1 from '@/resusableComponents/Heading1.vue';
import QuestionList from '@/views/questions/QuestionList.vue';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import testAttemptService from '@/services/testAttemptService';
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

const testsStore = useTestsStore();
const testAttemptStore = useTestAttemptStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();

// Get the testId from the url, will be needed to get the full test details data
const testId = Number(route.params.id);

let data = reactive({
    test: {} as Test
});

const createTestAttempt = async () => {
    try {

        const testAttempData = {
            test_id: testId,
            user_id: authStore.userId,
        }

        const userAnswers = testAttemptStore.userAnswers;

        await testAttemptService.create(testAttempData, userAnswers);

        // Reset the test attempt data in the store
        testAttemptStore.resetTestAttempt();

        //Display feedback to the user about succesfully submitting the test
        ElMessageBox.alert('You have successfully submitted the test.', 'Confirmation', {
            confirmButtonText: 'OK',
            callback: (action: Action) => {
                if (action === 'confirm') {
                    logout();
                }
            },
        })


        //TODO ANDOR Make sure that the user can not submit this test again.
        //TODO ANDOR Probably revoking the the invitation for this test? Redirecting to login? Permission?

    } catch (error) {
        handleBackendErrors(error);
    }
}

const logout = async () => {
    await authStore.signOut();
    router.push('/login');
};

onMounted(async () => {
    try {
        data.test = await testsStore.get(testId);
    } catch (error) {
        handleBackendErrors(error);
    }
});



</script>

<style scoped></style>
