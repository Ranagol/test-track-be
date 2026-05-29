<template>
    <div class="flex justify-center">

        <el-button
            type="success"
            @click="addNewAnswerOption"
            size="large"
        >Add new answer option</el-button>

    </div>
</template>

<script setup lang="ts">
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const testEditorStore = useTestEditorStore();

const props = defineProps<{
    questionId: number;
}>();

const addNewAnswerOption = () => {
    testEditorStore.addNewAnswerOption(props.questionId);
};
</script>

<style scoped>
</style>
