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

const props = withDefaults(defineProps<{

    mode: 'create' | 'edit' | 'take';

    beValidationErrors?: Record<string, any>;

}>(), {
    beValidationErrors: () => ({})
});

</script>
