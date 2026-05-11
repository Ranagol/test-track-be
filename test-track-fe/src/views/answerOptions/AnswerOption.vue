<template>
    <div>
        {{ answerOption.text }}
    </div>
</template>

<script setup lang="ts">
import type { AnswerOption } from '@/types/types';

const props = defineProps<{
    answerOption: AnswerOption;
}>();
</script>

<style scoped>

</style>
