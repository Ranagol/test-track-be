<template>

    <!-- TEST TITLE AND DESCRIPTION -->
    <TestDetails
        :mode="props.mode"
    />

    <!-- QUESTIONS AND ANSWERS-->
    <QuestionList
        :mode="props.mode"
    />

</template>

<script
    setup
    lang="ts"
>

import TestDetails from '@/views/tests/test/TestDetails.vue';
import QuestionList from '@/views/questions/QuestionList.vue';
import type { Mode } from '@/types/types';

// Modes are 'take' | 'edit' | 'create'
const props = defineProps<{
    mode: Mode;
}>();

</script>
