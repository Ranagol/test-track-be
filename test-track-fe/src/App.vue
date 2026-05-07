<template>
    <Navbar/>
    <RouterView></RouterView>
</template>

<script
    setup
    lang="ts"
>
import Navbar from '@/views/navbar/Navbar.vue';
import { onMounted } from 'vue';
import { useAuthStore } from './stores/useAuthStore';
import { getCsrfCookie } from '@/services/authService';

let authStore = useAuthStore();

onMounted(async () => {
    await getCsrfCookie();
});


</script>
