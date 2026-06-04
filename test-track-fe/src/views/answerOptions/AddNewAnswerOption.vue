<template>
    <div class="flex justify-center">

        <el-button
            type="success"
            @click="addNewAnswerOption"
            size="small"
        >Add new answer option</el-button>

    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    questionId: string;
}>();


const emit = defineEmits(['addNewAnswerOption']);

const addNewAnswerOption = () => {
    emit('addNewAnswerOption');
};

</script>

<style scoped>
</style>
