<template>
    <div>
        {{ answerOption.text }}
    </div>
</template>

<script setup lang="ts">
/**
 * AnswerOption display one possible answer for a question, in 'take' mode, for the test taker.
 * Displays all relevant info in 'create' and 'edit' mode, for the tester.
 */
import type { AnswerOption } from '@/types/types';

const props = defineProps<{
    answerOption: AnswerOption;
    mode: 'create' | 'edit' | 'take' | undefined;
}>();
</script>

<style scoped>

</style>
