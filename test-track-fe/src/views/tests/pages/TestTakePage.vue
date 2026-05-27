<template>
    <Container>

        <TestBase
            mode="take"
        />

        <TestTakeButton />

    </Container>

</template>

<script
    setup
    lang="ts"
>
import TestBase from '@/views/tests/test/TestBase.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import Container from '@/views/tests/test/Container.vue';
import TestTakeButton from '@/views/tests/test/TestTakeButton.vue';

const route = useRoute();
const testEditorStore = useTestEditorStore();

onMounted( async() => {
    const testCode = route.params.testCode as string;
    await testEditorStore.getByCode(testCode);
});
</script>
