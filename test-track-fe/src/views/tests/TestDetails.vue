<template>
    <Heading1
        :text="'Test: ' + (data.test.title ?? 'Test details')"
    />

    <QuestionList
        :questions="data.test.questions || []"
    />

    <DisplayBackendError
        :generalError="generalError"
    />

    <!-- <small>{{ testsStore.test }}</small> -->
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { useApiErrors } from '@/composables/useApiErrors';
import { useRoute } from 'vue-router';
import type { Test } from '@/types/types';
import Heading1 from '@/resusableComponents/Heading1.vue';
import QuestionList from '@/views/questions/QuestionList.vue';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';

const testsStore = useTestsStore();
const route = useRoute();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();

const testId = Number(route.params.id);


let data = reactive({
    test: {} as Test
});

onMounted(async () => {
    try {
        data.test = await testsStore.get(testId);
    } catch (error) {
        handleBackendErrors(error);
    }
});

// POSSIBLE FUTURE LOGIC
// const store = useTestAttemptStore();

// onMounted(() => {
//     store.initializeAttempt(testId, userId); // userId from auth store
// });

// const submitTest = async () => {
//     const { testAttempt, userAnswers } = store.getSubmissionData();

//     // Create attempt on backend
//     const attempt = await api.createTestAttempt(testAttempt);

//     // Create user answers with the attempt ID
//     for (const answer of userAnswers) {
//         await api.createUserAnswer({
//             ...answer,
//             test_attempt_id: attempt.id,
//         });
//     }

//     store.reset();
// };



</script>

<style scoped></style>
