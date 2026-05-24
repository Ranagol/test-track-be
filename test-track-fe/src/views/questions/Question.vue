<template>
    <div class="font-bold mt-8">

        <!-- QUESTION DISPLAY FOR TESTING -->
        <div
            v-if="props.mode === 'take'"
        >{{props.question.text}}</div>

        <!-- QUESTION DISPLAY FOR EDITING -->
        <QuestionDetails
            v-if="props.mode === 'edit'"
            :question="props.question"
            :mode="props.mode"
            :index="props.index"
        />

    </div>

    <!-- ANSWER OPTIONS -->
    <AnswerOptionList
        :question="props.question"
        :mode="props.mode"
        :index="props.index"
    />

</template>

<script setup lang="ts">
/**
 * Question.vue is used for testing purpose in 'take' mode. Then it simply display the question
 * text and the answer options as radio buttons. And sends the selected answer option to the test
 * attempt store.
 */
import type { Question } from '@/types/types';
import QuestionDetails from '@/views/questions/QuestionDetails.vue';
import AnswerOptionList from '@/views/answerOptions/AnswerOptionList.vue';


const props = defineProps<{

    question: Question;

    mode: 'create' | 'edit' | 'take' | undefined;

    /**
     * index is used to number the questions displayed to the test taker.
     */
    index: number;
}>();

</script>

<style scoped>

</style>
