<template>
    <div>
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
import Heading1 from '@/resusableComponents/Heading1.vue';


const props = defineProps<{
    questions: QuestionType[];
}>();


</script>

<style scoped>

</style>
