<template>

    <!-- QUESTION TEXT -->
    <el-form>

        <!-- :label="`${index + 1}.`" display the order number of the question -->
        <el-form-item
            :label="`${index + 1}.`"
        >
            <!-- QUESTION TEXT INPUT & DISPLAY -->
            <el-input
                v-model="questionText"
                @change="updateQuestion"
            />

        </el-form-item>
    </el-form>

    <DisplayBackendError
        :generalError="generalError"
    />

</template>

<script setup lang="ts">
/**
 * QuestionDetails is for question editing by the tester.
 */
import type { Question } from '@/types/types';
import { computed } from 'vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import { ElMessage } from 'element-plus';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import { useApiErrors } from '@/composables/useApiErrors';

const testEditorStore = useTestEditorStore();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();

const props = defineProps<{
    question: Question;
    mode: 'create' | 'edit' | 'take';

    //index is used to number the questions displayed to the test taker.
    index: number;
}>();

const questionText = computed({

    // Display the question text
    get: () => props.question.text,

    // Set the new question text in the store
    set: (newValue) => {

        // Immediatelly update letter by letter the question text in the store
        testEditorStore.setQuestionTextInStore(props.question.id, newValue)
    }
})

/**
 * Send the question update to the backend, but not for every letter change.
 */
const updateQuestion = async () => {
    try {
        await testEditorStore.updateQuestionInBackend(props.question.id);
        ElMessage({
            message: 'Question updated successfully.',
            type: 'success',
        })
    } catch (error) {
        handleBackendErrors(error);
    }
};

</script>

<style scoped>

</style>
