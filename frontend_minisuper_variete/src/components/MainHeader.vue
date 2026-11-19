<script setup lang="ts">
import { useAuthStore } from '@/stores/index'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const menuOpen = ref(false)

const isAuthenticated = computed(() => !!authStore.token)
const isAdmin = computed(() => authStore.rol === 'admin')

function logout() {
  authStore.logout()
  menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <!-- header section start -->
  <div class="header_section">
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="index.html"><img src="/images/logo.png"></a>
        <button class="navbar-toggler" type="button" @click="toggleMenu" aria-controls="navbarSupportedContent"
          :aria-expanded="menuOpen" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div :class="['collapse navbar-collapse', { show: menuOpen }]" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto">

            <!-- Enlaces públicos -->
            <li class="nav-item active">
              <RouterLink to="/" class="nav-link" @click="closeMenu">Inicio</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/catalogo" class="nav-link" @click="closeMenu">Catálogo</RouterLink>
            </li>

            <!-- Enlaces admin -->
            <template v-if="isAdmin">
              <li class="nav-item">
                <RouterLink to="/productos" class="nav-link" @click="closeMenu">Productos</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/proveedores" class="nav-link" @click="closeMenu">Proveedores</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/clientes" class="nav-link" @click="closeMenu">Clientes</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/ventas" class="nav-link" @click="closeMenu">Punto de Venta</RouterLink>
              </li>
            </template>
          </ul>

          <!-- Ingresar o Salir -->
          <template v-if="!isAuthenticated">
            <RouterLink to="/login" class="btn btn-outline-light btn-sm" @click="closeMenu">
              <i class="fa fa-user"></i> Iniciar Sesión
            </RouterLink>
          </template>
          <template v-if="isAuthenticated">
            <button class="btn btn-outline-danger btn-sm mt-2" @click="logout">
              <i class="fa fa-sign-out"></i> Salir ({{ authStore.user }})
            </button>
          </template>
        </div>
      </nav>
    </div>
  </div>
  <!-- header section end -->

</template>

<style scoped></style>
