<template>
    <TestBase mode="create" />
</template>

<script
    setup
    lang="ts"
>
import TestBase from '@/views/tests/test/TestBase.vue';
import { onMounted } from 'vue';
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const testEditorStore = useTestEditorStore();

onMounted(() => {
    testEditorStore.initializeNewTest();
});
</script>
