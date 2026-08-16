<template>

    <!-- VALIDATION ERROR MESSAGE FOR ALL ANSWER OPTION MISSING SELECTION -->
    <div
        v-if="props.showError"
        class="error-message"
    >

        <!-- BE validation text: "Exactly one answer option must be marked as correct." -->
        {{ props.backendErrorMessage }}
    </div>

</template>

<script setup lang="ts">
/**
 * Displays AnswerOption selection validation error message. Specifically, if there is no Answer Option selected.
 * There are two cases when this component will display the error message:
 * 1. The FE validation is commented out in TestTakePage, TestCreatePage and TestEditPage. Then the
 * request will be sent to the BE, and the BE will validate the answer options and return an error
 * message. Frankly said, the BE message should never be shown (although it works), because the FE
 * validation should stop sending a request to BE.
 * 2. The FE validation... I use el-form built in validation for all form fields. Except, to
 * validate if the answer option selection is missing. That does not work with nested radio groups.
 * So I made a my own validation logic for this part. When my own validation logic triggers, this
 * component is shown, with the 'Please select one answer.' message.
 */

const props = withDefaults(defineProps<{

    /**
     * Controlled by a bunch of watchers and @change events. When the answer option selection is null,
     * and that is a validation error, then this component will show the error message.
     */
    showError: boolean;
    backendErrorMessage?: string;
}>(), {
    showError: false,

    /**
     * Fallback error message. when there is no BE validation error message, but there is still a
     * FE validation error (showError will be then true), then this message will be shown.
     */
    backendErrorMessage: 'Please select the correct answer.'
});

</script>

<style scoped>

.error-message {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 4px;
}

</style>
