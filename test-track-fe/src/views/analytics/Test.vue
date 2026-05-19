<template>

    <Heading1
        :text="props.test?.title || 'Test details'"
    />

    

    <small>
        <pre>
            {{ props.test }}
        </pre>
    </small>

</template>

<script setup lang="ts">
import type { Test } from '@/types/types';
import Heading1 from '@/resusableComponents/Heading1.vue';

const props = defineProps<{
    test: Test | null;
}>();

</script>

<style scoped>
</style>
