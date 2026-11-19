<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import http from '@/plugins/axios'
import type { Producto } from '@/models/producto'
import type { Categoria } from '@/models/categoria'

const categorias = ref<Categoria[]>([])
const categoriaActiva = ref<number | null>(null)

const productos = ref<Producto[]>([])

async function obtenerProductos() {
  productos.value = await http.get('productos').then((response) => response.data)
}

// 1. Traer categorías igual que productos
async function obtenerCategorias() {
  categorias.value = await http.get('categorias').then((response) => response.data)
}

// 2. Filtrar los productos según el botón seleccionado
const productosFiltrados = computed(() => {
  if (categoriaActiva.value === null) return productos.value
  return productos.value.filter((p) => p.categoria?.id === categoriaActiva.value)
})

onMounted(() => {
  obtenerProductos()
  obtenerCategorias()
})

const placeholderImg = 'https://via.placeholder.com/300x200?text=Sin+Imagen'
</script>

<template>
  <div class="catalogo">
    <div class="banner-item-01 text-center py-5 text-white" style="background: linear-gradient(135deg, #1a6692 0%, #121212 100%);">
      <div class="container py-5">
        <h4 class="text-uppercase" style="color: #f33f3f;">Bienvenido a</h4>
        <h2 class="text-uppercase" style="letter-spacing: 5px;">Minisúper Variete</h2>
        <p class="mt-3">Los mejores productos al mejor precio</p>
      </div>
    </div>

    <div class="container mt-5">
      <div class="section-heading">
        <h2>Nuestros Productos</h2>
      </div>
      <div class="filters mb-4">
        <button
          class="btn btn-sm me-2"
          :class="categoriaActiva === null ? 'btn-danger' : 'btn-outline-secondary'"
          @click="categoriaActiva = null"
        >
          Todos
        </button>
        <button
          v-for="cat in categorias"
          :key="cat.id"
          class="btn btn-sm me-2"
          :class="categoriaActiva === cat.id ? 'btn-danger' : 'btn-outline-secondary'"
          @click="categoriaActiva = cat.id"
        >
          {{ cat.nombre }}
        </button>
      </div>

      <!-- 3. Usar productosFiltrados en lugar de productos -->
      <div class="row">
        <div v-for="p in productosFiltrados" :key="p.id" class="col-md-3 col-sm-6 mb-4">
          <div class="product-item">
            <img :src="p.imagen || placeholderImg" :alt="p.nombre" class="img-fluid" />
            <div class="down-content">
              <h4>{{ p.nombre }}</h4>
              <h6>Bs. {{ p.precio }}</h6>
              <p class="text-muted small">{{ p.categoria?.nombre }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="productosFiltrados.length === 0" class="text-center py-5">
        <p class="text-muted">No hay productos en esta categoría.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-item {
  border: 1px solid #eee;
  transition: all 0.3s;
}
.product-item:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.product-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.product-item .down-content {
  padding: 20px;
  position: relative;
}
.product-item .down-content h4 {
  font-size: 16px;
  color: #1a6692;
  margin-bottom: 10px;
  font-weight: 500;
}
.product-item .down-content h6 {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 16px;
  color: #f33f3f;
  font-weight: 700;
}
.section-heading {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 30px;
}
.section-heading h2 {
  font-size: 24px;
  color: #121212;
}
.filters button {
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
}
</style>