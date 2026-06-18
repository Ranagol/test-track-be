<template>
    <div class="flex justify-center">

        <el-button
            :id="`add-new-answer-option-button-${props.questionIndex}`"
            type="success"
            @click="addNewAnswerOption"
            size="small"
        >Add new answer option</el-button>

    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    questionId: string;

    /**
     * questionIndex is needed to create a unique id for the new answer option, which is used for
     * during Playwright testing.
     */
    questionIndex: number;
}>();


const emit = defineEmits(['addNewAnswerOption']);

const addNewAnswerOption = () => {
    emit('addNewAnswerOption');
};

</script>

<style scoped>
</style>
