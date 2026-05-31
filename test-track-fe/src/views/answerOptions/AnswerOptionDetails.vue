<template>
    <div>

        <!-- ANSWER OPTION TEXT -->
        <el-input
            v-model="answerOptionText"
            placeholder="Answer option text"
            @change="updateAnswerOptionText"
        />

        <DisplayBackendError
            :generalError="generalError"
        />

    </div>
</template>

<script setup lang="ts">

import { useTestEditorStore } from '@/stores/useTestEditorStore';
import type { AnswerOption } from '@/types/types';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import { useApiErrors } from '@/composables/useApiErrors';

const testEditorStore = useTestEditorStore();
const {
    generalError,
    handleBackendErrors
} = useApiErrors();

const props = defineProps<{
    answerOption: AnswerOption;
    questionId: number | string;
    mode: 'create' | 'edit' | 'take';
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

/**
 * Used for 'edit' mode only. With this, we actually send a request to the backend to update the
 * answer option text.
 */
const updateAnswerOptionText = async () => {
    if (props.mode !== 'edit') {
        return;
    }

    try {

        // Only for edit mode
        if (props.mode !== 'edit') {
            return;
        }

        // In edit mode question and answer option ids are always numbers.
        if (typeof props.questionId !== 'number' || typeof props.answerOption.id !== 'number') {
            return;
        }

        await testEditorStore.updateAnswerOptionText(
            props.questionId,
            props.answerOption.id,
            answerOptionText.value
        );

        ElMessage({
            message: 'Answer option updated successfully.',
            type: 'success',
        })
    } catch (error) {
        handleBackendErrors(error);
    }
};


</script>

<style scoped>

</style>
