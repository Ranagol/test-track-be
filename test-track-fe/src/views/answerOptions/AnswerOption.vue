<template>
    <!-- TEST TAKER -->
    <div v-if="props.mode === 'take'" class="answer-text">
        {{ props.answerOption.text }}
    </div>

    <!-- EDIT / CREATE -->
    <div v-else class="answer-option-content">
        <AnswerOptionDetails
            :answerOption="props.answerOption"
            :questionId="props.questionId"
            :mode="props.mode"
        />
    </div>
</template>

<script setup lang="ts">
import type { AnswerOption } from '@/types/types';
import AnswerOptionDetails from '@/views/answerOptions/AnswerOptionDetails.vue';

const props = defineProps<{
    answerOption: AnswerOption;
    questionId: number | string;
    mode: 'create' | 'edit' | 'take';
}>();
</script>

<style scoped>
.answer-option-content {
    flex: 1;
    min-width: 0;
}

.answer-text {
    flex: 1;
}
</style>
