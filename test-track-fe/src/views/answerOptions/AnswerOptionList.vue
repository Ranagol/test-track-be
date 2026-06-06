<template>

    <!-- VALIDATION ERROR MESSAGE FOR ALL ANSWER OPTION MISSING SELECTION -->
    <AnswerOptionValidationError
        :QuestionIndex="props.questionIndex"
        :mode="props.mode"
        :showError="showError"
        :errorMessage="props.beValidationErrors?.[`questions.${props.questionIndex}.answer_options`]?.[0]"
    />

    <!-- ANSWER OPTIONS IN RADIO GROUP -->
    <RadioGroup
        :mode="props.mode"
        :question="props.question"
        :questionId="props.question.id"
        :questionIndex="props.questionIndex"
        :beValidationErrors="props.beValidationErrors"
        @showError="setShowError"
        @selectedAnswerOption="setSelectedAnswerOption"
    />

    <AddNewAnswerOption
        v-if="props.mode === 'create' && typeof props.question.id === 'string'"
        :questionId="props.question.id"
        class="mt-4"
        @addNewAnswerOption="addNewAnswerOption"

    />

</template>

<script setup lang="ts">

import type { Question } from '@/types/types';

import { ref } from 'vue';
import AddNewAnswerOption from '@/views/answerOptions/AddNewAnswerOption.vue';
import AnswerOptionValidationError from '@/views/answerOptions/AnswerOptionValidationError.vue';
import RadioGroup from '@/views/answerOptions/RadioGroup.vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const testEditorStore = useTestEditorStore();

const props = defineProps<{
    question: Question;
    mode: 'create' | 'edit' | 'take';
    questionIndex: number;
    beValidationErrors: Record<string, any>;
}>();

/**
 * Whether the validation error message for missing correct answer option selection should be shown
 */
const showError = ref(false);

const setShowError = (value: boolean) => {
    showError.value = value;
};

const selectedAnswerOption = ref<number | string | null>(null);
const setSelectedAnswerOption = (answerOptionId: number | string | null) => {
    selectedAnswerOption.value = answerOptionId;
};

/**
 * Adds a new answer option in create mode.
 */
const addNewAnswerOption = () => {
    if (props.mode !== 'create' && typeof props.question.id !== 'string') {
        return;
    }
    testEditorStore.addNewAnswerOption(props.question.id as string);

    if (selectedAnswerOption.value === null) {
        showError.value = true;
    }
};

</script>

<style scoped>
</style>
