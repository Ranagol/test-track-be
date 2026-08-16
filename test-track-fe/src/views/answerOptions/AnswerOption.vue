<template>

    <!-- RENDER THIS FOR TEST TAKER -->
    <div v-if="props.mode === 'take'">{{ props.answerOption.text }}</div>

    <!-- RENDER THIS FOR TEST CREATION/EDITING -->
    <div v-if="props.mode === 'edit' || props.mode === 'create'">

        <AnswerOptionDetails
            :answerOption="props.answerOption"
            :questionId="props.questionId"
            :mode="props.mode"
            :questionIndex="props.questionIndex"
            :answerOptionIndex="props.answerOptionIndex"
            :beValidationErrors="props.beValidationErrors"
            @deleteAnswerOption="deleteAnswerOption"
        />

    </div>
</template>

<script setup lang="ts">
/**
 * AnswerOption display one possible answer for a question, in 'take' mode, for the test taker.
 * Displays all relevant info in 'create' and 'edit' mode, for the tester.
 */
import type { AnswerOption, BackendError } from '@/types/types';
import AnswerOptionDetails from '@/views/answerOptions/AnswerOptionDetails.vue';

const props = defineProps<{

    answerOption: AnswerOption;

    questionId: number | string;

    mode: 'create' | 'edit' | 'take';

    questionIndex: number;

    answerOptionIndex: number;

    beValidationErrors: BackendError;
}>();

const emit = defineEmits<{
    deleteAnswerOption: [id: string]
}>();

const deleteAnswerOption = (id: string) => {
    emit('deleteAnswerOption', id);
}

</script>

<style scoped>

</style>
