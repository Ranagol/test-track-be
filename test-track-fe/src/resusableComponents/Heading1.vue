<template>
    <h1 class="text-2xl mt-3">{{ text }}</h1>
</template>

<script setup lang="ts">

const props = defineProps<{
    text: string
}>();


</script>

<style scoped></style>
