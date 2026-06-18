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
                :error="props.beValidationErrors.title?.[0]"
            >
                <el-input
                    id="test-title-input"
                    v-model="testEditorStore.test.title"
                    placeholder="Enter test title"
                    class="mb-1"
                />
            </el-form-item>

            <el-form-item
                label-position="top"
                label="Test description"
                prop="description"
                :error="props.beValidationErrors.description?.[0]"
            >
                <el-input
                    id="test-description-input"
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

const props = defineProps<{
    mode: 'create' | 'edit' | 'take';
    beValidationErrors: Record<string, any>;
}>();

const testEditorStore = useTestEditorStore();


</script>
