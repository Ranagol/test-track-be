<template>

    <!-- LOOPS ALL QUESTIONS WITH THEIR ANSWER OPTIONS -->
    <Question
        v-for="(question, index) in testEditorStore.test?.questions || []"
        :key="question.id"
        :question="question"
        :index="index"
        :mode="props.mode"
    />

    <hr class="mt-4">

    <AddNewQuestionButton
        class="mt-4"
        v-if="props.mode === 'create'"
    />

</template>

<script
    setup
    lang="ts"
>

// We use here QuestionType (and not Question), because there is a Question component
import Question from '@/views/questions/Question.vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import AddNewQuestionButton from '@/views/questions/AddNewQuestion.vue';

const testEditorStore = useTestEditorStore();

const props = defineProps<{
    mode: 'create' | 'edit' | 'take';
}>();


</script>

<style scoped></style>
