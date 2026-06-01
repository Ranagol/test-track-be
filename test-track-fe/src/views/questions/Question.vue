<template>
    <div class="font-bold mt-8">

        <!-- QUESTION DISPLAY FOR TESTING -->
        <div
            v-if="props.mode === 'take'"
        >{{props.question.text}}</div>

        <!-- QUESTION DISPLAY FOR EDIT AND CREATE -->
        <QuestionDetails
            v-else
            :question="props.question"
            :mode="props.mode"
            :index="props.index"
            @delete="deleteQuestion"
        />

    </div>

    <!-- ANSWER OPTIONS -->
    <AnswerOptionList
        :question="props.question"
        :mode="props.mode"
    />

</template>

<script setup lang="ts">
/**
 * QuestionDetails is used for editing the question by the tester.
 * In 'take' mode, it simply display the question text and the answer options.
 */
import type { Question } from '@/types/types';
import QuestionDetails from '@/views/questions/QuestionDetails.vue';
import AnswerOptionList from '@/views/answerOptions/AnswerOptionList.vue';
import { ElMessage } from 'element-plus';
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const testEditorStore = useTestEditorStore();

const props = defineProps<{

    question: Question;

    mode: 'create' | 'edit' | 'take';

    //index is used to number the questions displayed to the test taker.
    index: number;
}>();



const deleteQuestion = async (questionId: string) => {

    testEditorStore.deleteQuestion(questionId);

    ElMessage.success({message: 'Question deleted.',})
};

</script>

<style scoped>

</style>
