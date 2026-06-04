<template>

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
import { ref, onMounted } from 'vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import AddNewAnswerOption from '@/views/answerOptions/AddNewAnswerOption.vue';

const testAttemptStore = useTestAttemptStore();
const testEditorStore = useTestEditorStore();

const props = defineProps<{
    question: Question;
    mode: 'create' | 'edit' | 'take';
    questionIndex: number;
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

    // Setting the correct AO can happen in 'edit' mode
    if (props.mode === 'edit' && typeof props.question.id === 'number') {
        testEditorStore.setAnswerOptionIsCorrectInStore(
            props.question.id,
            answerOptionId
        );
    }
};

/**
 * In 'edit' mode we want to display the currently correct answer option as selected.
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
