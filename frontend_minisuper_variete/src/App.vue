<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/index'
import { computed, ref } from 'vue'

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
  <!-- BARRA DE NAVEGACION -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container">
      <RouterLink to="/" class="navbar-brand fw-bold" @click="closeMenu">
        Minisúper <span style="color: #f33f3f;">Variete</span>
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
              <RouterLink to="/ventas" class="nav-link" @click="closeMenu">
                <i class="bi bi-cart"></i> Ventas
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/historial-ventas" class="nav-link" @click="closeMenu">
                <i class="bi bi-clock-history"></i> Historial
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

  <!-- CONTENIDO -->
  <main class="container my-4">
    <RouterView />
  </main>

  <!-- FOOTER -->
  <footer class="bg-dark text-white text-center py-3 mt-5">
    <p class="mb-0 small">Copyright © 2026 Minisúper Variété</p>
  </footer>
</template>

<style scoped>
/* Ajuste mínimo para que el navbar se vea bien */
.navbar-brand {
  font-size: 1.25rem;
}
</style>
