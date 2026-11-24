<script setup lang="ts">
//import { RouterView } from 'vue-router'
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/style.css'
import '@/assets/css/responsive.css'
import 'swiper/css'

import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
</script>

<template>
  <MainHeader />
  <RouterView />
  <MainFooter />
</template>

<style scoped>
.header_section {
  background-color: #1a1a1a;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
