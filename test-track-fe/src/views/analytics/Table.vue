<template>
    <h2>Table</h2>

</template>

<script setup lang="ts">
import type { Test } from '@/types/types';

const props = defineProps<{
    test: Test
}>();

</script>
