<template>
    <el-radio-group
        v-model="selectedAnswerOption"
        class="mt-3"
        style="display: flex; flex-direction: column; align-items: flex-start;"
        @change="onChange"
    >

        <!-- RADIO BUTTON -->
        <el-radio
            v-for="(answerOption, answerOptionIndex) in (question.answer_options || [])"
            :key="answerOption.id"
            :value="answerOption.id"
            :label="answerOption.id"
        >

            <!-- ANSWER OPTION -->
            <AnswerOption
                :answerOption="answerOption"
                :mode="props.mode"
                :questionId="props.question.id"
                :questionIndex="props.questionIndex"
                :answerOptionIndex="answerOptionIndex"
                :beValidationErrors="props.beValidationErrors"
                @deleteAnswerOption="deleteAnswerOption"
            />
        </el-radio>

    </el-radio-group>
</template>

<script setup lang="ts">
import AnswerOption from '@/views/answerOptions/AnswerOption.vue';
import type { Question } from '@/types/types';
import { ref, onMounted, watch } from 'vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import { useValidateAnswerOnTakeTest } from '@/composables/answerOptionListComposables/useValidateAnswerOnTakeTest';
import { useSelectAnswer } from '@/composables/answerOptionListComposables/useSelectAnswer';
import { useValidateAnswerBackend } from '@/composables/answerOptionListComposables/useValidateAnswerBackend';

const testEditorStore = useTestEditorStore();

const emit = defineEmits<{
    showError: [show: boolean]
    selectedAnswerOption: [answerOptionId: number | string | null]
}>();

/**
 * Make the answer option select validation error message visible
 */
const emitShowError = (show: boolean) => {
    emit('showError', show);
}

const emitSelectedAnswerOption = (answerOptionId: number | string | null) => {
    emit('selectedAnswerOption', answerOptionId);
}

const props = defineProps<{
    question: Question;
    mode: 'create' | 'edit' | 'take';
    questionIndex: number;
    beValidationErrors: Record<string, any>;
}>();

const onChange =() => {
    console.log('Selected answer option id:', selectedAnswerOption.value);

    // Handle the answer option selection in 'take', 'create' and 'edit' mode
    handleAnswerSelection(selectedAnswerOption.value);

    // Inform the parent component (AnswerOptionList) about the selected answer option
    emitSelectedAnswerOption(selectedAnswerOption.value);

    // Check if an answer option is selected, and show or hide the validation error message accordingly
    checkIfAnswerOptionSelected();
}

/**
 * This variable is used for three different cases:
 * 1. In take mode: the test taker selected this answer option, during testing.
 * 2. In create mode: this is the correct answer option, selected by the tester, during test creation.
 * 3. In edit mode: this is the correct answer option, selected by the tester, during test editing.
 *
 * It contains the id of the selected answer option, or null if no answer option is selected.
 */
let selectedAnswerOption = ref<number | string | null>(null);

// Composable 1: AO selection validation before test taker submits
useValidateAnswerOnTakeTest(selectedAnswerOption, emitShowError);

// Composable 2: AO selection handling in 'take', 'create' and 'edit' mode
const { handleAnswerSelection } = useSelectAnswer(props.mode, props.question);

// Composable 4: AO selection BACKEND validation
useValidateAnswerBackend(
    emitShowError,
    selectedAnswerOption,
    props.beValidationErrors,
    props.questionIndex
);

/**
     * Decides whether to show the validation error message for missing correct answer option selection.
     * It only works for FE, and it used constantly.
     */
    const checkIfAnswerOptionSelected = (): void => {

        if (selectedAnswerOption.value === null) {

            emitShowError(true);
            return;
        }

        emitShowError(false);
    };

/**
 * Deletes the answer option in create mode.
 */
const deleteAnswerOption = async (answerOptionId: string) => {
    if (props.mode !== 'create') {
        return;
    }

    // In create mode question and answer option ids are not strings, return.
    if (typeof props.question.id !== 'string') {
        return;
    }

    testEditorStore.deleteAnswerOption(
        props.question.id as string,
        answerOptionId
    );

    /**
     * If accidentally the deleted answer option was selected as correct answer option, deselect it
     * by setting selectedAnswerOption to null.
     */
    if (selectedAnswerOption.value === answerOptionId) {
        selectedAnswerOption.value = null;
    }

    checkIfAnswerOptionSelected();
};

/**
 * In 'edit' mode, on mount, we want to display the currently correct answer option as selected.
 * This must not happen in 'take' mode never!!!
 */
onMounted(() => {

    // If in edit mode
    if (props.mode === 'edit' && typeof props.question.id === 'number') {

        // Find the correct answer option for this question,
        const correctAnswerOption = props.question.answer_options?.find(ao => ao.is_correct);
        if (correctAnswerOption) {

            // and set it as selected
            selectedAnswerOption.value = correctAnswerOption.id;
        }
    }
});


</script>

<style scoped>
</style>
