<template>
    <div class="font-bold text-red-500 mt-8">
        {{ index + 1 }}. {{ question.text }}
    </div>

    <el-radio-group
        v-model="selectedAnswerOption"
        class="mt-3"
        style="display: flex; flex-direction: column; align-items: flex-start;"
    >
        <el-radio
            v-for="answerOption in question.answer_options"
            :key="answerOption.id"
            :value="answerOption.id"
        >
            <span>
                <AnswerOption :answerOption="answerOption" />
            </span>

        </el-radio>
    </el-radio-group>



</template>

<script setup lang="ts">
import type { QuestionType } from '@/types/types';
import AnswerOption from '@/views/answerOptions/AnswerOption.vue';
import { ref, watch } from 'vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';

const testAttemptStore = useTestAttemptStore();

const props = defineProps<{
    question: QuestionType;

    /**
     * index is used to number the questions displayed to the test taker.
     */
    index: number;
}>();

/**
 * The test taker selected this answer option, during testing.
 */
const selectedAnswerOption = ref<number | null>(null);

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
