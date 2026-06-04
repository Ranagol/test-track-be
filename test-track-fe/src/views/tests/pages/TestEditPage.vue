<template>
    <Container>

        <el-form
            ref="validationRef"
            :model="testEditorStore.test"
            :rules="testRules"
            :hide-required-asterisk="true"
            :scroll-to-error="true"
        >

            <Heading1
                text="Edit test"
            />

            <!-- THE TEST -->
            <TestBase
                mode="edit"
            />

            <DisplayBackendError
                :generalError="generalError"
            />

            <FinalButton
                class="mt-4"
                buttonText="Update test"
                buttonType="primary"
                @click="updateTest"
            />

        </el-form>

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
import FinalButton from '@/views/tests/test/FinalButton.vue';
import Heading1 from '@/resusableComponents/Heading1.vue';
import { useApiErrors } from '@/composables/useApiErrors';
import { ElMessage } from 'element-plus';
import DisplayBackendError from '@/resusableComponents/DisplayBackendError.vue';
import Container from '@/views/tests/test/Container.vue';
import  { testRules } from '@/validationRules/testRules';

const {
    generalError,
    handleBackendErrors
} = useApiErrors();

const route = useRoute();
const testEditorStore = useTestEditorStore();

const updateTest = async () => {
    try {
        await testEditorStore.update();
        ElMessage.success('Test updated');
    } catch (e) {
        handleBackendErrors(e);
    }
};

onMounted(async () => {
    const id = Number(route.params.id);
    await testEditorStore.get(id);
});

</script>
