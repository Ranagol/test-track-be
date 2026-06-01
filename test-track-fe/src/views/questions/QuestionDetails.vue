<template>

    <!-- QUESTION TEXT -->
    <el-form>

        <!-- :label="`${index + 1}.`" display the order number of the question -->
        <el-form-item
            :label="`${index + 1}.`"
        >
            <div class="question-row">

                <!-- QUESTION TEXT INPUT & DISPLAY -->
                <el-input
                    id="question-text-input"
                    v-model="questionText"
                    placeholder="Enter question text"
                    @change="handleChange"
                />

                <!-- DELETE BUTTON -->
                <el-button
                    v-if="props.mode === 'create'"
                    :icon="Delete"
                    text
                    @click="deleteQuestion"
                />
            </div>

        </el-form-item>
    </el-form>

</template>

<script setup lang="ts">
/**
 * QuestionDetails is for question editing/creating by the tester.
 */
import type { Question } from '@/types/types';
import { computed } from 'vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import { Delete } from '@element-plus/icons-vue'

const testEditorStore = useTestEditorStore();

const props = defineProps<{

    mode: 'create' | 'edit';

    question: Question;

    //index is used to number the questions displayed to the test taker.
    index: number;
}>();

const questionText = computed({

    // Display the question text
    get: () => props.question.text,

    // Set the new question text in the store
    set: (newValue) => {

        // Immediatelly update letter by letter the question text in the store. Edit and create mode.
        testEditorStore.setQuestionTextInStore(props.question.id, newValue)
    }
})

const emit = defineEmits(['change', 'delete']);

const handleChange = () => {
    if (props.mode === 'edit') {
        emit('change');
    }
}

const deleteQuestion = () => {
    if (props.mode === 'create') {
        emit('delete', props.question.id);
    }
}




</script>

<style scoped>
.question-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.question-row :deep(.el-input) {
    flex: 1;
}

</style>
