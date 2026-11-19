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
<<<<<<< HEAD
=======
  <!-- BARRA DE NAVEGACION -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container">
      <RouterLink to="/" class="navbar-brand fw-bold" @click="closeMenu">
        Minisúper <span style="color: #f33f3f">Variete</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
        aria-controls="navbarNav"
        :aria-expanded="menuOpen"
        aria-label="Menú"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div :class="['collapse navbar-collapse', { show: menuOpen }]" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Enlaces públicos -->
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" @click="closeMenu">
              <i class="bi bi-house"></i> Inicio
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/catalogo" class="nav-link" @click="closeMenu">
              <i class="bi bi-shop"></i> Catálogo
            </RouterLink>
          </li>

          <!-- Enlaces admin -->
          <template v-if="isAdmin">
            <li class="nav-item">
              <RouterLink to="/productos" class="nav-link" @click="closeMenu">
                <i class="bi bi-box-seam"></i> Productos
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/proveedores" class="nav-link" @click="closeMenu">
                <i class="bi bi-truck"></i> Proveedores
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/clientes" class="nav-link" @click="closeMenu">
                <i class="bi bi-people"></i> Clientes
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/ventas/nueva" class="nav-link" @click="closeMenu">
                <i class="bi bi-people"></i> Punto de venta
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/ventas" class="nav-link" @click="closeMenu">
                <i class="bi bi-receipt"></i> Ventas
              </RouterLink>
            </li>
          </template>
        </ul>

        <!-- Login o Salir -->
        <ul class="navbar-nav">
          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <RouterLink to="/login" class="btn btn-outline-light btn-sm mt-1" @click="closeMenu">
                <i class="bi bi-box-arrow-in-right"></i> Login
              </RouterLink>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <button class="btn btn-outline-danger btn-sm mt-1" @click="logout">
                <i class="bi bi-box-arrow-right"></i> Salir ({{ authStore.user }})
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>

>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
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
