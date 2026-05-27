<template>

    <!-- LOOPS ALL QUESTIONS WITH THEIR ANSWER OPTIONS -->
    <Question
        v-for="(question, index) in questions"
        :key="question.id"
        :question="question"
        :index="index"
        :mode="props.mode"
    />

</template>

<script setup lang="ts">

// We use here QuestionType (and not Question), because there is a Question component
import Question from '@/views/questions/Question.vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const props = defineProps<{
    mode: 'create' | 'edit' | 'take' ;
}>();

const testEditorStore = useTestEditorStore();
const questions = testEditorStore.test?.questions || [];

</script>

<style scoped></style>
