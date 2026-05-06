<template>
    <Navbar></Navbar>
    <RouterView></RouterView>
</template>

<script
    setup
    lang="ts"
>
import Navbar from '@/components/Navbar.vue';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/useAuthStore';

let authStore = useAuthStore();

onMounted(async () => {
    await authStore.initAuth();
});


</script>
