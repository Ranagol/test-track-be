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

const testAttemptStore = useTestAttemptStore();

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
    (newValue) => {

        // For test taking
        if (newValue !== null && props.mode === 'take') {
            testAttemptStore.updateUserAnswers(props.question.id, newValue);
        }

        // For test (answer option) editing
        if (newValue !== null && props.mode === 'edit') {

            // TODO ANDOR Here we should update the correct answer option for the question, in the test store, but we don't have a function for that yet. So we will just log the new value for now.

            // testAttemptStore.updateUserAnswers(props.question.id, newValue);
        }
    }
);

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
