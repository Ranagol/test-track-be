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

const props = defineProps<{
    answerOption: AnswerOption;
    questionId: number;
    mode: 'create' | 'edit' | 'take' | undefined;
}>();




</script>

<style scoped>

</style>
