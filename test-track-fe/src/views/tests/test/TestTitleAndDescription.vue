<template>

    <div
        v-if="testEditorStore.test"
        class="mt-3"
    >

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

            <el-form-item
                label="Test title"
                label-position="top"
                prop="title"
            >
                <el-input
                    v-model="testEditorStore.test.title"
                    placeholder="Enter test title"
                    class="mb-1"
                />
            </el-form-item>

            <el-form-item
                label-position="top"
                label="Test description"
                prop="description"
            >
                <el-input
                    v-model="testEditorStore.test.description"
                    placeholder="Enter test description"
                    type="textarea"
                    class="mb-1"
                />
            </el-form-item>

        </div>
    </div>

</template>

<script
    setup
    lang="ts"
>
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import { el } from 'element-plus/es/locale/index.mjs';

const props = defineProps<{
    mode: 'create' | 'edit' | 'take';
}>();

const testEditorStore = useTestEditorStore();


</script>
