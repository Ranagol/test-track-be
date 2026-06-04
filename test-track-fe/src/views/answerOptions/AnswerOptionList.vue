<template>

    <!-- VALIDATION ERROR MESSAGE FOR ALL ANSWER OPTION MISSING SELECTION -->
    <AnswerOptionValidationError
        :QuestionIndex="props.questionIndex"
        :beValidationErrors="props.beValidationErrors"
        :mode="props.mode"
        :showError="showError"
        :errorMessage="props.beValidationErrors?.[`questions.${props.questionIndex}.answer_options`]?.[0]"
    />

    <!-- ANSWER OPTIONS -->
    <el-radio-group
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
    />

</template>

<script setup lang="ts">

import type { Question } from '@/types/types';
import AnswerOption from '@/views/answerOptions/AnswerOption.vue';
import { ref, computed, watch } from 'vue';
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
const handleAnswerSelection = async (answerOptionId: number | string) => {

    // For test taking (UserAnswer) - the user has selected this answer for the given question
    if (props.mode === 'take' && typeof props.question.id === 'number') {
        testAttemptStore.updateUserAnswers(
            props.question.id,
            answerOptionId
        );
    }

    // Setting the correct AO can happen in 'create' mode
    if (props.mode === 'create' && typeof props.question.id === 'string') {
        testEditorStore.setAnswerOptionIsCorrectInStore(
            props.question.id,
            answerOptionId
        );
    }
};

const showError = ref(false);

/**
 * Decides whether to show the validation error message for missing correct answer option selection.
 */
const continousErrorChecker = (): void => {

    if (props.mode === 'create' && !selectedAnswerOption.value) {

        showError.value = true;
        return;
    }

    showError.value = false;
};

const onMountErrorChecker = (): void => {

    const validationError = props.beValidationErrors?.[`questions.${props.questionIndex}.answer_options`]?.[0];

    if (props.mode === 'create' && validationError && !selectedAnswerOption.value) {

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
    },
    { deep: true }
);

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

    continousErrorChecker();

};


</script>

<style scoped>

</style>
