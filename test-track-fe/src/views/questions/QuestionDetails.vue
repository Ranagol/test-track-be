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
                placeholder="Enter question text"
                @change="handleChange"
            />

        </el-form-item>
    </el-form>

</template>

<script setup lang="ts">
/**
 * QuestionDetails is for question editing/creating by the tester.
 */
import type { Question } from '@/types/types';
import { computed } from 'vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const testEditorStore = useTestEditorStore();

const props = defineProps<{
    question: Question;

    //index is used to number the questions displayed to the test taker.
    index: number;
}>();

const questionText = computed({

    // Display the question text
    get: () => props.question.text,

    // Set the new question text in the store
    set: (newValue) => {

        // Immediatelly update letter by letter the question text in the store
        testEditorStore.setQuestionTextInStore(props.question.id, newValue)
    }
})

const emit = defineEmits(['change']);

const handleChange = () => {
    emit('change');
}




</script>

<style scoped>

</style>
