<template>

    <!-- VALIDATION ERROR MESSAGE FOR ALL ANSWER OPTION MISSING SELECTION -->
    <AnswerOptionValidationError
        :QuestionIndex="props.questionIndex"
        :mode="props.mode"
        :showError="showError"
        :errorMessage="props.beValidationErrors?.[`questions.${props.questionIndex}.answer_options`]?.[0]"
    />

    <!-- ANSWER OPTIONS -->
    <el-radio-group
        id="answer-options-radio-group"
        v-model="selectedAnswerOption"
        class="mt-3"
        style="display: flex; flex-direction: column; align-items: flex-start;"
        @change="handleAnswerSelection"
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

    <AddNewAnswerOption
        v-if="props.mode === 'create' && typeof props.question.id === 'string'"
        :questionId="props.question.id"
        class="mt-4"
        @addNewAnswerOption="addNewAnswerOption"
    />

</template>

<script setup lang="ts">

import type { Question } from '@/types/types';
import AnswerOption from '@/views/answerOptions/AnswerOption.vue';
import { ref, onMounted, watch, inject, type Ref } from 'vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import AddNewAnswerOption from '@/views/answerOptions/AddNewAnswerOption.vue';
import AnswerOptionValidationError from '@/views/answerOptions/AnswerOptionValidationError.vue';

const testAttemptStore = useTestAttemptStore();
const testEditorStore = useTestEditorStore();

const props = defineProps<{
    question: Question;
    mode: 'create' | 'edit' | 'take';
    questionIndex: number;
    beValidationErrors: Record<string, any>;
}>();

/**
 * This variable is used for two different cases:
 * 1. In take mode: the test taker selected this answer option, during testing.
 * 2. In create mode: this is the correct answer option, selected by the tester, during test creation.
 *
 * It contains the id of the selected answer option, or null if no answer option is selected.
 */
const selectedAnswerOption = ref<number | string | null>(null);

/**
 * Answer selection happens in two cases in this component:
 * 1. When the test taker selects an answer option during test taking (mode = 'take'),
 * 2. When the tester selects the correct answer option during test creation (mode = 'create').
 */
const handleAnswerSelection = (answerOptionId: number | string) => {

    // For test taking (UserAnswer) - the user has selected this answer for the given question
    if (props.mode === 'take' && typeof props.question.id === 'number' && typeof answerOptionId === 'number') {
        testAttemptStore.updateUserAnswers(
            props.question.id,
            answerOptionId
        );
    }

    // Setting the correct AO can happen in 'create' mode
    if (props.mode === 'create' && typeof props.question.id === 'string' && typeof answerOptionId === 'string') {
        testEditorStore.setAnswerOptionIsCorrectInStore(
            props.question.id,
            answerOptionId
        );
    }

    // Setting the correct AO can happen in 'edit' mode
    if (props.mode === 'edit' && typeof props.question.id === 'number' && typeof answerOptionId === 'number') {
        testEditorStore.setAnswerOptionIsCorrectInStore(
            props.question.id,
            answerOptionId
        );
    }
};

/**
 * Whether the validation error message for missing correct answer option selection should be shown
 */
const showError = ref(false);

/**
 * Decides whether to show the validation error message for missing correct answer option selection.
 */
const continousErrorChecker = (): void => {

    if (selectedAnswerOption.value === null) {

        showError.value = true;
        return;
    }

    showError.value = false;
};

const onMountErrorChecker = (): void => {

    const validationError = props.beValidationErrors?.[`questions.${props.questionIndex}.answer_options`]?.[0];

    if (validationError && !selectedAnswerOption.value) {

        showError.value = true;
        return;
    }

    showError.value = false;
};

watch(
    () => selectedAnswerOption.value,
    (newValue, oldValue) => {
        console.log('selectedAnswerOption changed:');
        console.log('oldValue:', oldValue)
        console.log('newValue:', newValue)
        continousErrorChecker();
    },
);

watch(
    () => props.beValidationErrors?.[`questions.${props.questionIndex}.answer_options`]?.[0],
    (newValue, oldValue) => {
        console.log('beValidationErrors changed:');
        console.log('oldValue:', oldValue)
        console.log('newValue:', newValue)
        onMountErrorChecker();
    }
);

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
        props.question.id,
        answerOptionId
    );

    /**
     * If accidentally the deleted answer option was selected as correct answer option, deselect it
     * by setting selectedAnswerOption to null.
     */
    if (selectedAnswerOption.value === answerOptionId) {
        selectedAnswerOption.value = null;
    }

    continousErrorChecker();

};

/**
 * Adds a new answer option in create mode.
 */
const addNewAnswerOption = () => {
    if (props.mode !== 'create' && typeof props.question.id !== 'string') {
        return;
    }
    testEditorStore.addNewAnswerOption(props.question.id as string);

    continousErrorChecker();
};

/**
 * We inject the reportError() function, provided by TestTakePage.
 */
const reportError = inject<() => void>('reportError');
const validationCycle = inject<Ref<number>>('validationCycle');

/**
 * This function will:
 * 1. trigger the showing of the validation error message
 * 2. stop the submitting a request to the BE.
 */
const validate = () => {

    // If there is no selected answer option for this question...
    if (selectedAnswerOption.value === null) {

        // ... then show the error message for this question...
        showError.value = true;

        // ... and report the error to the TestTakePage, so it can stop the test attempt submission.
        reportError?.();
    }

};

/**
 * When the validationCycle changes, it means that the TestTakePage sent a signal: hey, please check
 * if the test take has selected anser option for his questions.
 * So, watcher then triggers the validate() function.
 */
watch(validationCycle!, () => {
    validate();
});

/**
 * In 'edit' mode we want to display the currently correct answer option as selected. This must not
 * happen in 'take' mode never!!!
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
