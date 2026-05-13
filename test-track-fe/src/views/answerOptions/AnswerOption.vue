<template>
    <div>
        {{ answerOption.text }}
    </div>
</template>

<script setup lang="ts">
/**
 * AnswerOption display one possible answer for a question.
 */
import type { AnswerOption } from '@/types/types';

const props = defineProps<{
    answerOption: AnswerOption;
}>();
</script>

<style scoped>

</style>
