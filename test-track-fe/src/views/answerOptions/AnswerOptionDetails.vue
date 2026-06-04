<template>
    <el-form-item
        :prop="`questions.${props.questionIndex}.answer_options.${props.answerOptionIndex}.text`"
        :rules="[{ required: true, message: 'Answer option text is required.' }]"
        :error="props.beValidationErrors?.[`questions.${props.questionIndex}.answer_options.${props.answerOptionIndex}.text`]?.[0]"
    >
        <div class="question-row">

            <!-- ANSWER OPTION TEXT -->
            <el-input
                id="answer-option-text-input"
                v-model="answerOptionText"
                placeholder="Answer option text"
            />

            <!-- DELETE BUTTON -->
            <el-button
                v-if="props.mode === 'create'"
                :icon="Delete"
                text
                @click="deleteAnswerOption"
            />
        </div>
    </el-form-item>
</template>

<script setup lang="ts">

import { useTestEditorStore } from '@/stores/useTestEditorStore';
import type { AnswerOption } from '@/types/types';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue'

const testEditorStore = useTestEditorStore();

const props = defineProps<{

    answerOption: AnswerOption;

    questionId: number | string;

    mode: 'create' | 'edit' | 'take';

    questionIndex: number;

    answerOptionIndex: number;

    beValidationErrors: Record<string, any>;

}>();

/**
 * Used for 'create' and 'edit' mode.
 */
const answerOptionText = computed({

    // Display the question text
    get: () => props.answerOption.text,

    // Set the answer option text in the store, immediatelly letter by letter, while the tester is typing
    set: (newValue) => {

        // Immediatelly update letter by letter the question text in the store
        testEditorStore.setAnswerOptionTextInStore(
            props.questionId,
            props.answerOption.id,
            newValue
        );
    }
});

const deleteAnswerOption = async () => {
    if (props.mode !== 'create') {
        return;
    }

    // In create mode question and answer option ids are always strings.
    if (typeof props.questionId !== 'string' || typeof props.answerOption.id !== 'string') {
        return;
    }

    testEditorStore.deleteAnswerOption(
        props.questionId,
        props.answerOption.id
    );

};


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
