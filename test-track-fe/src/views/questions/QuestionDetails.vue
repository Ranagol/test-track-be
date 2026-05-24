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
                :disabled="props.mode === 'take'"
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
import { ref, watch, reactive, computed } from 'vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { ElMessage } from 'element-plus';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import { useApiErrors } from '@/composables/useApiErrors';

const testsStore = useTestsStore();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();

const props = defineProps<{

    question: Question;

    mode: 'create' | 'edit' | 'take' | undefined;

    /**
     * index is used to number the questions displayed to the test taker.
     */
    index: number;
}>();


const questionText = computed({

    // Display the question text
    get: () => props.question.text,
    set: (newValue) => {

        // Immediatelly update letter by letter the question text in the store
        testsStore.updateQuestionText(props.index, newValue)
    }
})

/**
 * Send the question update to the backend.
 */
const updateQuestion = async () => {
    try {
        testsStore.updateQuestion(props.question.id);
        ElMessage({
            message: 'Test updated successfully.',
            type: 'success',
        })
    } catch (error) {
        handleBackendErrors(error);
    }


};

</script>

<style scoped>

</style>
