<template>
    <TestBase mode="edit" />
</template>

<script
    setup
    lang="ts"
>
import TestBase from '@/views/tests/test/TestBase.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const route = useRoute();
const testEditorStore = useTestEditorStore();

onMounted(async () => {
    const id = Number(route.params.id);
    await testEditorStore.get(id);
});
</script>
