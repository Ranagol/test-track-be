<template>

    <div v-if="testEditorStore.test">

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

        <el-button
            v-if="props.mode === 'create'"
            type="primary"
            @click="save"
            class="mt-4"
        >
            Save Test
        </el-button>

        <!-- <div
            v-if="mode === 'take'"
        >
            <h1
                v-if="testEditorStore.test"
                class="text-3xl font-bold mb-4"
            >{{testEditorStore.test.title}}</h1>

            <p
                v-if="testEditorStore.test"
                class="text-gray-700"
            >{{testEditorStore.test.description}}</p>
        </div> -->

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
