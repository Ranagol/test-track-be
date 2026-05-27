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
import { ref, onMounted } from 'vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import { ElMessage } from 'element-plus';

const testAttemptStore = useTestAttemptStore();
const testEditorStore = useTestEditorStore();

const props = defineProps<{
    question: Question;
    mode: 'create' | 'edit' | 'take';
}>();

/**
 * In take mode: the test taker selected this answer option, during testing.
 * In edit mode: this is the correct answer option, selected by the tester, during test creation/editing.
 *
 * It contains the id of the selected answer option, or null if no answer option is selected.
 */
const selectedAnswerOption = ref<number | null>(null);

/**
 * Answer selection happens in two cases in this component:
 * 1. When the test taker selects an answer option during test taking (mode = 'take'),
 * 2. When the tester selects/changes the correct answer option during test editing (mode = 'edit').
 */
const handleAnswerSelection = async (answerOptionId: number) => {

    // For test taking (UserAnswer) - the user has selected this answer for the given question
    if (props.mode === 'take') {
        testAttemptStore.updateUserAnswers(
            props.question.id,
            answerOptionId
        );
    }

    // For test editing (AnswerOption) - this is the correct answer option for the given question
    if (props.mode === 'edit') {
        await testEditorStore.updateAnswerOptionIsCorrect(
            props.question.id,
            answerOptionId
        );
        ElMessage.success('Correct answer option updated successfully.');
    }
};

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
