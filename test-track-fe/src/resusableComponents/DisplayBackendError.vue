<template>

    <el-alert
        v-if="generalError"
        type="error"
        :title="generalError"
        show-icon
        class="mt-3"
    />

    <el-alert
        v-if="validationError"
        type="error"
        :title="validationError"
        show-icon
        class="mt-3"
    />

</template>

<script setup lang="ts">

const props = defineProps<{
    generalError: string
    validationError?: string
}>();


</script>

<style scoped></style>
