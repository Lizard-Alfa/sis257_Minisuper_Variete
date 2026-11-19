<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
</script>

<template>
  <MainHeader />
  <main class="container my-4">
    <RouterView />
  </main>
  <MainFooter />
</template>

<style>
@import '@/assets/css/bootstrap.min.css';
@import '@/assets/css/style.css';
@import '@/assets/css/responsive.css';
@import 'swiper/css';
</style>
