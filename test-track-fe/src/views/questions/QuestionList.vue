<template>
    <div>
        <Heading1
            text="Question list"
        />

        <!-- QUESTION LIST -->
        <div>
            <Question
                v-for="(question, index) in questions"
                :key="question.id"
                :question="question"
                :index="index"
            />
        </div>
    </div>




</template>

<script setup lang="ts">
import type { QuestionType } from '@/types/types';
import Question from '@/views/questions/Question.vue';


const props = defineProps<{
    questions: QuestionType[];
}>();


</script>

<style scoped>

</style>
