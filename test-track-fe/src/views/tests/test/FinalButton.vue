<template>

    <el-form-item class="flex flex-col items-end">

        <el-button
            @click="handleClick"
            class="mt-4"
            :type="props.buttonType"
        >
            {{ props.buttonText }}
        </el-button>

    </el-form-item>

</template>

<script
    setup
    lang="ts"
>

const props = defineProps({
    buttonText: {
        type: String,
        required: true,
    },
    buttonType: {
        type: String,
        required: true,
    }
});

const emit = defineEmits(['click']);

const handleClick = () => {
    emit('click');
}


</script>
