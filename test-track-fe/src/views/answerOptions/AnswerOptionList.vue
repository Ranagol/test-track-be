<template>

    <!-- ANSWER OPTIONS -->
    <el-radio-group
        v-model="selectedAnswerOption"
        class="mt-3"
        style="display: flex; flex-direction: column; align-items: flex-start;"
    >

        <!-- RADIO BUTTON -->
        <el-radio
            v-for="answerOption in (question.answer_options || [])"
            :key="answerOption.id"
            :value="answerOption.id"
        >
            <span>

                <!-- ANSWER OPTION -->
                <AnswerOption
                    :answerOption="answerOption"
                    :mode="props.mode"
                    :questionId="props.question.id"
                />
            </span>

        </el-radio>
    </el-radio-group>

</template>

<script setup lang="ts">
/**
 * Question.vue is used for testing purpose in 'take' mode. Then it simply display the question
 * text and the answer options as radio buttons. And sends the selected answer option to the test
 * attempt store.
 */
import type { Question } from '@/types/types';
import AnswerOption from '@/views/answerOptions/AnswerOption.vue';
import { ref, watch, onMounted } from 'vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useTestsStore } from '@/stores/useTestsStore';

const testAttemptStore = useTestAttemptStore();
const testsStore = useTestsStore();

const props = defineProps<{
    question: Question;
    mode: 'create' | 'edit' | 'take' | undefined;

    /**
     * index is used to number the questions displayed to the test taker.
     */
    index: number;
}>();

/**
 * In take mode: the test taker selected this answer option, during testing.
 * In edit mode: this is the correct answer option, selected by the tester, during test creation/editing.
 *
 * It contains the id of the selected answer option, or null if no answer option is selected.
 */
const selectedAnswerOption = ref<number | null>(null);

/**
 * When the user selects an answer option, this watcher will be triggered, and it will update the
 * user answers in the test attempt store.
 */
watch(
    selectedAnswerOption,
    (answerOptionId) => {

        // For test taking (UserAnswer) - this is the users answer
        if (answerOptionId !== null && props.mode === 'take') {
            testAttemptStore.updateUserAnswers(props.question.id, answerOptionId);
        }

        // For test editing (AnswerOption) - this is correct answer option
        if (answerOptionId !== null && props.mode === 'edit') {

            // TODO ANDOR this solution here has one big problem: in test editing, at the very beginning it immediatelly sends a request to the backend, for the initial value setup. This must be fixed.
            testsStore.updateAnswerOptionIsCorrect(props.question.id, answerOptionId);
        }
    }
);

/**
 * Get the ID of the correct answer option for the question. Needed at the very beginning of the
 * test editing, when we set the correct AnswerOption in the el-radio to be displayed as selected.
 */
const getCorrectAnswerOptionId = (): number | null => {

    const correctAnswerOption = props.question.answer_options?.find(
        (answerOption) => answerOption.is_correct
    );

    return correctAnswerOption ? correctAnswerOption.id : null;
}

onMounted(() => {

    /**
     * When in 'edit' mode, at the beginning we need to display in the el-radio, which answer option
     * is the correct one.
     */
    if (props.mode === 'edit') {
        // Set the selected answer option for the question, from the test attempt store, when the component is mounted.
        selectedAnswerOption.value = getCorrectAnswerOptionId();
    }
});





</script>

<style scoped>

</style>
