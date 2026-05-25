<template>
    <div>
        <Question
            v-for="(question, index) in questions"
            :key="question.id"
            :question="question"
            :index="index"
            :mode="props.mode"
        />
    </div>
</template>

<script setup lang="ts">
/**
 * Displays all questions.
 */

// We use here QuestionType (and not Question), because there is a Question component
import type { Question as QuestionType } from '@/types/types';
import Question from '@/views/questions/Question.vue';

const props = defineProps<{
    questions: QuestionType[];
    mode: 'create' | 'edit' | 'take' ;
}>();

</script>

<style scoped></style>
