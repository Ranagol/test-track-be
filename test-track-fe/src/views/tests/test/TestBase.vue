<template>

    <TestTitleAndDescription
        :mode="props.mode"
        :beValidationErrors="props.beValidationErrors"
    />

    <!-- QUESTIONS AND ANSWERS-->
    <QuestionList
        :mode="props.mode"
        :beValidationErrors="props.beValidationErrors"
    />

</template>

<script
    setup
    lang="ts"
>

import TestTitleAndDescription from '@/views/tests/test/TestTitleAndDescription.vue';
import QuestionList from '@/views/questions/QuestionList.vue';
import type { Mode } from '@/types/types';

// Modes are 'take' | 'edit' | 'create'
const props = defineProps<{
    mode: Mode;
    beValidationErrors: Record<string, any>;
}>();

</script>
