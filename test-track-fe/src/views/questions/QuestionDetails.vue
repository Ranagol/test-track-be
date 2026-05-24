<template>

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

</template>

<script setup lang="ts">
/**
 * QuestionDetails is for question editing by the tester.
 */
import type { Question } from '@/types/types';
import { ref, watch, reactive, computed } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';

const testsStore = useTestsStore();

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

</script>

<style scoped>

</style>
