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
                @change="onFieldChange"
                placeholder="Enter test title"
            />

            <el-input
                v-model="testEditorStore.test.description"
                :rows="4"
                @change="onFieldChange"
                placeholder="Enter test description"
                type="textarea"
            />
        </div>
    </div>

</template>

<script
    setup
    lang="ts"
>
import { useTestEditorStore } from '@/stores/useTestEditorStore';
import { ElMessage } from 'element-plus';
import { useApiErrors } from '@/composables/useApiErrors';

const props = defineProps<{
    mode: 'create' | 'edit' | 'take';
}>();

const testEditorStore = useTestEditorStore();
const { handleBackendErrors } = useApiErrors();

const onFieldChange = () => {
    if (props.mode === 'edit') {
        save();
    }
};

// TODO ANDOR these function must be moved to the parent component
const save = async () => {
    try {
        const test = testEditorStore.test;
        if (!test) return;

        // CREATE
        if (props.mode === 'create') {
            const created = await testEditorStore.create();
            ElMessage.success('Test created');
            return created;
        }

        // EDIT
        await testEditorStore.update(test.id!);
        ElMessage.success('Test updated');

    } catch (e) {
        handleBackendErrors(e);
    }
};
</script>
