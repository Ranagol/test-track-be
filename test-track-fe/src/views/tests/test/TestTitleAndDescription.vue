<template>

    <div v-if="testEditorStore.test">

        <!-- TAKE MODE -->
        <div v-if="mode === 'take'">
            <h1
                v-if="testEditorStore.test"
                class="text-3xl font-bold mb-4"
            >{{testEditorStore.test.title}}</h1>

            <p
                v-if="testEditorStore.test"
                class="text-gray-700"
            >{{testEditorStore.test.description}}</p>
        </div>

        <!-- EDIT AND CREATE MODE -->
        <div v-else>

            <el-input
                v-model="testEditorStore.test.title"
                placeholder="Enter test title"
                class="mb-4"
            />

            <el-input
                v-model="testEditorStore.test.description"
                :rows="4"
                placeholder="Enter test description"
                type="textarea"
                class="mb-4"
            />
        </div>
    </div>

</template>

<script
    setup
    lang="ts"
>
import { useTestEditorStore } from '@/stores/useTestEditorStore';

const props = defineProps<{
    mode: 'create' | 'edit' | 'take';
}>();

const testEditorStore = useTestEditorStore();


</script>
