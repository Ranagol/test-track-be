<template>

    <div class="flex flex-col items-end">

        <el-button
            @click="createTestAttempt()"
            class="mt-6"
            type="primary"
        >
            Submit Test
        </el-button>
    </div>

</template>

<script
    setup
    lang="ts"
>
const emit = defineEmits(['createTestAttempt']);

const createTestAttempt = () => {
    emit('createTestAttempt');
}


</script>
