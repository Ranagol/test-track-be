<template>
    <div class="flex justify-center">

        <el-button
            id="add-new-question-button"
            type="success"
            @click="addNewQuestion"
            size="large"
        >Add new question</el-button>

    </div>
</template>

<script setup lang="ts">
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const testEditorStore = useTestEditorStore();

const addNewQuestion = () => {
    testEditorStore.addNewQuestion();
};
</script>

<style scoped>
</style>
