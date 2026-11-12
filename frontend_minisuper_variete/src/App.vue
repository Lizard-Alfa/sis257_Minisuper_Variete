<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/index'
import { computed } from 'vue'

const authStore = useAuthStore()

const isAuthenticated = computed(() => !!authStore.token)
const isAdmin = computed(() => authStore.rol === 'admin')

function logout() {
  authStore.logout()
}
</script>

<template>
  <header class="bg-dark text-white p-3 mb-4" v-if="isAuthenticated">
    <div class="container d-flex justify-content-between align-items-center">
      <h1 class="h4 m-0">Minisúper Variété</h1>
      <nav class="d-flex gap-3">
        <RouterLink to="/" class="text-white text-decoration-none">
          <i class="bi bi-house"></i> Inicio
        </RouterLink>
        <RouterLink to="/categorias" class="text-white text-decoration-none">
          <i class="bi bi-tags"></i> Categorías
        </RouterLink>

        <template v-if="isAdmin">
          <RouterLink to="/productos" class="text-white text-decoration-none">
            <i class="bi bi-box-seam"></i> Productos
          </RouterLink>
          <RouterLink to="/proveedores" class="text-white text-decoration-none">
            <i class="bi bi-truck"></i> Proveedores
          </RouterLink>
        </template>

        <button @click="logout" class="btn btn-outline-light btn-sm ms-3">
          <i class="bi bi-box-arrow-right"></i> Salir ({{ authStore.user }})
        </button>
      </nav>
    </div>
  </header>

  <main class="container">
    <RouterView />
  </main>
</template>

<style scoped>
header {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
