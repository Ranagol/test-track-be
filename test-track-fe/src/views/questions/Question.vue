<template>
    <div class="font-bold mt-8">

        <!-- QUESTION TEXT -->
        <el-form>
            <el-form-item
                :label="`${index + 1}.`"
            >
                <el-input
                    v-model="questionText"
                    :disabled="props.mode === 'take'"
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
                />
            </span>

        </el-radio>
    </el-radio-group>



</template>

<script setup lang="ts">
import type { QuestionType } from '@/types/types';
import AnswerOption from '@/views/answerOptions/AnswerOption.vue';
import { ref, watch, reactive, computed } from 'vue';
import { useTestAttemptStore } from '@/stores/useTestAttemptStore';
import { useTestsStore } from '@/stores/useTestsStore';


const testsStore = useTestsStore();
const testAttemptStore = useTestAttemptStore();

const props = defineProps<{

    question: QuestionType;

    mode: 'create' | 'edit' | 'take' | undefined;

    /**
     * index is used to number the questions displayed to the test taker.
     */
    index: number;
}>();


const questionText = computed({
    get: () => props.question.text,
    set: (newValue) => {
        testsStore.updateQuestionText(props.index, newValue)
    }
})

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
