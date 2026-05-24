<template>

    <!-- ANSWER OPTIONS -->
    <el-radio-group
        v-model="selectedAnswerOption"
        class="mt-3"
        style="display: flex; flex-direction: column; align-items: flex-start;"
    >

        <!-- RADIO BUTTON -->
        <el-radio
            v-for="answerOption in question.answer_options"
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
import { ref, watch } from 'vue';
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
 * The test taker selected this answer option, during testing. So, this is logic for 'take' mode, for
 * testing.
 */
const selectedAnswerOption = ref<number | null>(null);

/**
 * When the user selects an answer option, this watcher will be triggered, and it will update the
 * user answers in the test attempt store.
 */
watch(
    selectedAnswerOption,
    (newValue) => {
        if (newValue !== null) {
            testAttemptStore.updateUserAnswers(props.question.id, newValue);
        }
    }
);





</script>

<style scoped>

</style>
