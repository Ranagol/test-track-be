<template>

    <!-- TEST TITLE AND DESCRIPTION -->
    <Container>
        <TestDetails
            v-if="mode === 'take' || mode === 'edit'"
            :mode="mode"
        />

        <div
            v-if="mode === 'take'"
        >
            <!-- TITLE -->
            <h1
                v-if="testEditorStore.test"
                class="text-3xl font-bold mb-4"
            >{{testEditorStore.test.title}}</h1>

            <!-- DESCRIPTION -->
            <p
                v-if="testEditorStore.test"
                class="text-gray-700"
            >{{testEditorStore.test.description}}</p>
        </div>

    </Container>

    <!-- QUESTION LIST -->
    <Container>
        <QuestionList
            v-if="testEditorStore.test"
            :questions="testEditorStore.test.questions || []"
            :mode="mode"
        />
    </Container>

    <!-- TEST TAKE BUTTON -->
    <Container
        v-if="mode === 'take'"
    >
        <TestTakeButton/>
    </Container>

    <!-- DISPLAY BACKEND ERROR -->
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
import { onMounted, computed } from 'vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import { useApiErrors } from '@/composables/useApiErrors';
import { useRoute } from 'vue-router';
import QuestionList from '@/views/questions/QuestionList.vue';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import Container from '@/views/tests/Container.vue';
import TestDetails from '@/views/tests/TestDetails.vue';
import TestTakeButton from '@/views/tests/TestTakeButton.vue';
import type { Mode } from '@/types/types';

const testEditorStore = useTestEditorStore();
const route = useRoute();

const {
    generalError,
    handleBackendErrors
} = useApiErrors();



/**
 * Decides based on the route name, in which mode this component will be.
 * Mode can be:
 * 1. 'create' → when the tester is creating a new test, route: /tests/create
 * 2. 'edit' → when the tester is editing an existing test, route: /tests/:id
 * 3. 'take' → when the test taker is taking the test, route: /tests/take-test/:testCode
 * 4. If the route name is unknown, an error is thrown.
 */
const mode = computed<Mode>(() => {
    switch (route.name) {
        case 'test-create': return 'create';
        case 'test-edit': return 'edit';
        case 'test-take': return 'take';
        default:
            throw new Error(`Unknown route: ${String(route.name)}`);
    }
});

onMounted(async () => {

    try {

        // TAKE MODE
        if (mode.value === 'take') {

            //TODO ANDOR later check this line below, how it works, if works.
            const testCode = route.params.testCode as string;
            await testEditorStore.getByCode(testCode);

        // EDIT MODE
        } else if (mode.value === 'edit') {

            // Get the testId from the url
            const testId = Number(route.params.id);
            await testEditorStore.get(testId);

        // CREATE MODE
        } else if (mode.value === 'create') {

            testEditorStore.initializeNewTest();
        }



    } catch (error) {
        handleBackendErrors(error);
    }
});



</script>

<style scoped></style>
