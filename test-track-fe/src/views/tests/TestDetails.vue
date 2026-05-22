<template>

    <Container>
        <Heading1
            :text="(data.test.title ?? 'Test details')"
        />
    </Container>


    <Container>
        <QuestionList
            :questions="data.test.questions || []"
            :mode="mode"
        />
    </Container>


    <DisplayBackendError
        :generalError="generalError"
    />

    <Container>
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
    </Container>


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
import { onMounted, reactive, computed } from 'vue';
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
import Container from '@/views/tests/Container.vue';

const testsStore = useTestsStore();
const testAttemptStore = useTestAttemptStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();



let data = reactive({
    test: {} as Test
});

const mode = computed(() => {
    if (route.name === 'test-create') return 'create';
    if (route.name === 'test-edit') return 'edit';
    if (route.name === 'test-take') return 'take';
});

const createTestAttempt = async () => {
    try {

        const testAttempData = {
            test_id: data.test.id,
            user_id: authStore.userId,
        }

        const userAnswers = testAttemptStore.userAnswers;

        await testAttemptService.create(testAttempData, userAnswers);

        // Reset the test attempt data in the store
        testAttemptStore.resetTestAttempt();

        //Display feedback to the user about succesfully submitting the test
        ElMessageBox.alert(
            'You have successfully submitted the test. You will now signed out. Have a nice day! ',
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

const logout = async () => {
    await authStore.signOut();
    router.push('/login');
};

onMounted(async () => {

    try {

        // TAKE MODE
        if (mode.value === 'take') {

            //TODO ANDOR later check this line below, how it works, if works.
            const testCode = route.params.testCode as string;
            data.test = await testsStore.getByCode(testCode);

        // EDIT MODE
        } else if (mode.value === 'edit') {

            // Get the testId from the url
            const testId = Number(route.params.id);
            data.test = await testsStore.get(testId);
        }

        // CREATE MODE - for this mode does not need data fetch from backend

    } catch (error) {
        handleBackendErrors(error);
    }
});



</script>

<style scoped></style>
