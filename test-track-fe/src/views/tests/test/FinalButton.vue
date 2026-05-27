<template>

    <div class="flex flex-col items-end">

        <el-button
            @click="handleClick"
            class="mt-6"
            :type="props.buttonType"
        >
            {{ props.buttonText }}
        </el-button>

    </div>

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
