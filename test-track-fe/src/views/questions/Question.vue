<template>
    <div class="font-bold mt-8">

        <!-- QUESTION TEXT -->
        <el-form>

            <!-- :label="`${index + 1}.`" display the order number of the question -->
            <el-form-item
                :label="`${index + 1}.`"
            >
                <!-- QUESTION TEXT INPUT & DISPLAY -->
                <el-input
                    v-model="questionText"
                    :disabled="props.mode === 'take'"
                    @change="updateQuestion"
                />

            </el-form-item>
        </el-form>

    </div>

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
import type { Question } from '@/types/types';
import AnswerOption from '@/views/answerOptions/AnswerOption.vue';
import { ref, watch, reactive, computed } from 'vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useTestsStore } from '@/stores/useTestsStore';


const testsStore = useTestsStore();
const testAttemptStore = useTestAttemptStore();

const props = defineProps<{

    question: Question;

    mode: 'create' | 'edit' | 'take' | undefined;

    /**
     * index is used to number the questions displayed to the test taker.
     */
    index: number;
}>();


const questionText = computed({

    // Display the question text
    get: () => props.question.text,
    set: (newValue) => {

        // Immediatelly update letter by letter the question text in the store
        testsStore.updateQuestionText(props.index, newValue)
    }
})

const updateQuestion = () => {

    /**
     * Send the question update to the backend.
     */
    testsStore.updateQuestion(props.question.id);
};

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
