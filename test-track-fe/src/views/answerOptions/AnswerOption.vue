<template>

    <!-- RENDER THIS FOR TEST TAKER -->
    <div v-if="props.mode === 'take'">{{ props.answerOption.text }}</div>

    <!-- RENDER THIS FOR TEST CREATION/EDITING -->
    <div v-if="props.mode === 'edit' || props.mode === 'create'">
        <AnswerOptionDetails
            :answerOption="props.answerOption"
            :questionId="props.questionId"
            :mode="props.mode"
        />
    </div>
</template>

<script setup lang="ts">
/**
 * AnswerOption display one possible answer for a question, in 'take' mode, for the test taker.
 * Displays all relevant info in 'create' and 'edit' mode, for the tester.
 */
import type { AnswerOption } from '@/types/types';
import AnswerOptionDetails from '@/views/answerOptions/AnswerOptionDetails.vue';

const props = defineProps<{
    answerOption: AnswerOption;
    questionId: number;
    mode: 'create' | 'edit' | 'take';
}>();
</script>

<style scoped>

</style>
