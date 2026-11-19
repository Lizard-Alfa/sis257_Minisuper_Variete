<script setup lang="ts">
import { RouterView } from 'vue-router'

import '@/assets/js/jquery.min.js'
import '@/assets/js/popper.min.js'
import '@/assets/js/bootstrap.bundle.min.js'
import '@/assets/js/jquery-3.0.0.min.js'
import '@/assets/js/plugin.js'
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
import '@fortawesome/fontawesome-free/css/all.min.css'

</script>

<template>
  <!-- CONTENIDO -->
  <main class="container my-4">
    <MainHeader />
    <RouterView />
  </main>

   <MainFooter />

</template>

<style>
@import '@/assets/css/bootstrap.min.css';
@import '@/assets/css/style.css';
@import '@/assets/css/responsive.css';
@import "swiper/css";

</style>
