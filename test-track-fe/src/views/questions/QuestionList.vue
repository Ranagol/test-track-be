<template>
    <div>
        <!-- QUESTION LIST -->
        <div>
            <Question
                v-for="(question, index) in questions"
                :key="question.id"
                :question="question"
                :index="index"
                :mode="props.mode"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
// We use here QuestionType (and not Question), because there is a Question component
import type { Question as QuestionType } from '@/types/types';
import Question from '@/views/questions/Question.vue';


const props = defineProps<{

    questions: QuestionType[];

    // TODO ANDOR why do we need undefined here?
    mode: 'create' | 'edit' | 'take' | undefined;
}>();


</script>

<style scoped>

</style>
