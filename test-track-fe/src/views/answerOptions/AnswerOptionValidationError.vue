<template>
    <!-- VALIDATION ERROR MESSAGE FOR ALL ANSWER OPTION MISSING SELECTION -->
    <div
        v-if="props.showError"
        class="error-message"
    >

        <!-- "Exactly one answer option must be marked as correct." -->
        {{
            props.errorMessage ||
            'Exactly one answer option must be marked as correct FE source.'
        }}
    </div>

</template>

<script setup lang="ts">
/**
 * Displays AnswerOption validation error message. Specifically, if there is no Answer Option selected.
 *
 */

const props = defineProps<{

    mode: 'create' | 'edit' | 'take';

    beValidationErrors: Record<string, any>;

    showError: boolean;

    errorMessage: string;
}>();



</script>

<style scoped>

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 4px;
}

</style>
