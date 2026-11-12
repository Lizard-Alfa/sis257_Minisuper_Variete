<script setup lang="ts">
import { useAuthStore } from '@/stores/index'
import { computed } from 'vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.token)
</script>

<template>
  <div class="text-center py-5">
    <h1 class="display-4 mb-4">Bienvenido a Minisúper Variété</h1>
    <p class="lead mb-4">
      Tu tienda de confianza con los mejores productos al mejor precio.
    </p>

    <div v-if="!isAuthenticated" class="mt-5">
      <RouterLink to="/login" class="btn btn-primary btn-lg me-3">
        <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
      </RouterLink>
      <RouterLink to="/categorias" class="btn btn-outline-secondary btn-lg">
        <i class="bi bi-tags"></i> Ver Categorías
      </RouterLink>
    </div>

    <div v-else class="mt-5">
      <p class="text-success">
        <i class="bi bi-check-circle"></i> Sesión iniciada como <strong>{{ authStore.user }}</strong>
      </p>
      <RouterLink to="/categorias" class="btn btn-primary btn-lg">
        <i class="bi bi-tags"></i> Explorar Categorías
      </RouterLink>
    </div>
  </div>
</template>
