<template>
    <div class="font-bold text-red-500 mt-8">
        {{ index + 1 }}. {{ question.text }}
    </div>

    <el-radio-group
        v-model="selectedAnswerId"
        class="mt-3"
        style="display: flex; flex-direction: column; align-items: flex-start;"
    >
        <el-radio
            v-for="answerOption in question.answer_options"
            :key="answerOption.id"
            :label="answerOption.id"
        >
            <span>
                <AnswerOption :answerOption="answerOption" />
            </span>

        </el-radio>
    </el-radio-group>



</template>

<script setup lang="ts">
import type { QuestionType } from '@/types/types';
import AnswerOption from '@/views/answerOptions/AnswerOption.vue';
import { ref } from 'vue';

const props = defineProps<{
    question: QuestionType;
    index: number;
}>();

const selectedAnswerId = ref<number | null>(null);

</script>

<style scoped>

</style>
