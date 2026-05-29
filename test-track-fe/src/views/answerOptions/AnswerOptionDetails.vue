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
    questionId: number;
    mode: 'create' | 'edit' | 'take';
}>();

const answerOptionText = computed({

    // Display the question text
    get: () => props.answerOption.text,
    set: (newValue) => {

        // Immediatelly update letter by letter the question text in the store
        testEditorStore.setAnswerOptionTextInStore(
            props.questionId, props.answerOption.id, newValue
        );
    }
});

const updateAnswerOptionText = async () => {
    if (props.mode !== 'edit') {
        return;
    }

    try {

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
