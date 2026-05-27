<template>

    <!-- TEST DETAILS -->
        <TestDetails
            :mode="mode"
        />

    <!-- QUESTIONS -->
        <QuestionList
            :mode="mode"
            :questions="testEditorStore.test?.questions || []"
        />


    <!-- ERRORS -->
    <DisplayBackendError
        :generalError="generalError"
    />

</template>

<script
    setup
    lang="ts"
>
import { computed } from 'vue';

import { useTestEditorStore } from '@/stores/useTestEditorStore';
import { useApiErrors } from '@/composables/useApiErrors';

import Container from '@/views/tests/test/Container.vue';
import TestDetails from '@/views/tests/test/TestDetails.vue';
import QuestionList from '@/views/questions/QuestionList.vue';
import TestTakeButton from '@/views/tests/test/TestTakeButton.vue';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';

import type { Mode } from '@/types/types';

const props = defineProps<{
    mode: Mode;
}>();

const testEditorStore = useTestEditorStore();

const { generalError, handleBackendErrors } = useApiErrors();

const mode = computed(() => props.mode);

</script>
