<template>
    <div>

        <!-- ANSWER OPTION TEXT -->
        <el-input
            v-model="props.answerOption.text"
        />

    </div>
</template>

<script setup lang="ts">

import type { AnswerOption } from '@/types/types';
import { computed } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';

const testsStore = useTestsStore();

const props = defineProps<{
    answerOption: AnswerOption;
    questionId: number;
    mode: 'create' | 'edit' | 'take' | undefined;
}>();

const answerOptionText = computed({

    // Display the question text
    get: () => props.answerOption.text,
    set: (newValue) => {

        // Immediatelly update letter by letter the question text in the store
        testsStore.updateQuestionText(props.index, newValue)
    }
})


</script>

<style scoped>

</style>
