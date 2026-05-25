<template>

    <!-- TEST TITLE AND DESCRIPTION -->
    <Container>
        <TestDetails
            v-if="mode === 'edit'"
            :mode="mode"
        />

        <div
            v-if="mode === 'take'"
        >
            <h1 class="text-3xl font-bold mb-4">{{data.test.title}}</h1>
            <p class="text-gray-700">{{data.test.description}}</p>
        </div>

    </Container>

    <!-- QUESTION LIST -->
    <Container>
        <QuestionList
            :questions="data.test.questions || []"
            :mode="mode"
        />
    </Container>

    <Container
        v-if="mode === 'take'"
    >
        <TestTake
            :mode="mode"
        />
    </Container>

    <DisplayBackendError
        :generalError="generalError"
    />

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
import { useTestEditorStore } from '@/stores/testEditorStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useApiErrors } from '@/composables/useApiErrors';
import { useRoute, useRouter } from 'vue-router';
import type { Test } from '@/types/types';
import QuestionList from '@/views/questions/QuestionList.vue';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import Container from '@/views/tests/Container.vue';
import TestDetails from '@/views/tests/TestDetails.vue';
import TestTake from '@/views/tests/TestTake.vue';

const testEditorStore = useTestEditorStore();
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

/**
 * Decides based on the route name, in which mode this component will be.
 */
const mode = computed(() => {
    if (route.name === 'test-create') return 'create';
    if (route.name === 'test-edit') return 'edit';
    if (route.name === 'test-take') return 'take';
});

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
            data.test = await testEditorStore.getByCode(testCode);

        // EDIT MODE
        } else if (mode.value === 'edit') {

            // Get the testId from the url
            const testId = Number(route.params.id);
            data.test = await testEditorStore.get(testId);
        }

        // CREATE MODE - for this mode does not need data fetch from backend

    } catch (error) {
        handleBackendErrors(error);
    }
});



</script>

<style scoped></style>
