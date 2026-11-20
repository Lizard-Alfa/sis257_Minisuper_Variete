<script setup lang="ts">
import { useAuthStore } from '@/stores/index'
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()
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

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <!-- header section start -->
  <div class="header_section">
    <div class="container-fluid px-4">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <!-- Logo -->
        <RouterLink class="navbar-brand" to="/" @click="closeMenu">
          <img src="/images/logo.png" alt="Variete" style="max-height: 50px" />
        </RouterLink>

        <!-- Botón hamburguesa (móvil) -->
        <button
          class="navbar-toggler"
          type="button"
          @click="toggleMenu"
          aria-controls="navbarSupportedContent"
          :aria-expanded="menuOpen"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menú colapsable -->
        <div :class="['collapse navbar-collapse', { show: menuOpen }]" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto">
            <!-- Enlaces públicos -->
            <li class="nav-item" :class="{ active: isActive('/') }">
              <RouterLink to="/" class="nav-link" @click="closeMenu">Inicio</RouterLink>
            </li>
            <li class="nav-item" :class="{ active: isActive('/catalogo') }">
              <RouterLink to="/catalogo" class="nav-link" @click="closeMenu">Catálogo</RouterLink>
            </li>

            <!-- Enlaces admin -->
            <template v-if="isAdmin">
              <li class="nav-item" :class="{ active: isActive('/productos') }">
                <RouterLink to="/productos" class="nav-link" @click="closeMenu"
                  >Productos</RouterLink
                >
              </li>
              <li class="nav-item" :class="{ active: isActive('/proveedores') }">
                <RouterLink to="/proveedores" class="nav-link" @click="closeMenu"
                  >Proveedores</RouterLink
                >
              </li>
              <li class="nav-item" :class="{ active: isActive('/clientes') }">
                <RouterLink to="/clientes" class="nav-link" @click="closeMenu">Clientes</RouterLink>
              </li>
              <li class="nav-item" :class="{ active: isActive('/ventas') }">
                <RouterLink to="/ventas/nueva" class="nav-link text-nowrap" @click="closeMenu"
                  >Venta</RouterLink
                >
              </li>
              <li class="nav-item" :class="{ active: isActive('/ventas') }">
                <RouterLink to="/ventas" class="nav-link text-nowrap" @click="closeMenu"
                  >Historial</RouterLink
                >
              </li>
            </template>
          </ul>

          <!-- Botón Iniciar Sesión / Salir -->
          <div class="d-flex align-items-center ms-lg-3">
            <template v-if="!isAuthenticated">
              <RouterLink to="/login" class="btn btn-outline-light btn-sm" @click="closeMenu">
                <i class="fa fa-user me-1"></i> Iniciar Sesión
              </RouterLink>
            </template>
            <template v-else>
              <span class="text-white me-2 d-none d-md-inline">
                <i class="fa fa-user-circle"></i> {{ authStore.user }}
              </span>
              <button class="btn btn-outline-danger btn-sm" @click="logout">
                <i class="fa fa-sign-out me-1"></i> Salir
              </button>
            </template>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <!-- header section end -->
</template>

<style scoped>
/* Evita que "Punto de Venta" se parta en varias líneas */
.nav-link.text-nowrap {
  white-space: nowrap;
}

/* Resalta el ítem activo del menú */
.nav-item.active .nav-link {
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

/* Ajuste para que el botón de login no se pegue al borde en móvil */
@media (max-width: 991px) {
  .d-flex.align-items-center {
    margin-top: 10px;
    margin-left: 0 !important;
  }
}
</style>
