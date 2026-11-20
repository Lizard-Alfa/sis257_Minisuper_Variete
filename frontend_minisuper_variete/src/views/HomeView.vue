<script setup lang="ts">
import { useAuthStore } from '@/stores/index'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.token)

const categorias = [
  { nombre: 'Abarrotes',     slug: 'abarrotes',     img: '/images/img-1.png', desc: 'Arroz, fideos, aceite y más' },
  { nombre: 'Bebidas',       slug: 'bebidas',       img: '/images/img-2.png', desc: 'Gaseosas, jugos y agua' },
  { nombre: 'Lácteos',       slug: 'lacteos',       img: '/images/img-3.png', desc: 'Leche, queso y yogurt' },
  { nombre: 'Limpieza',      slug: 'limpieza',      img: '/images/img-4.png', desc: 'Detergentes y desinfectantes' },
  { nombre: 'Higiene Personal', slug: 'higiene',    img: '/images/img-5.png', desc: 'Jabón, shampoo y más' },
  { nombre: 'Panadería',     slug: 'panaderia',     img: '/images/img-6.png', desc: 'Pan, galletas y tostadas' },
  { nombre: 'Snacks',        slug: 'snacks',        img: '/images/img-7.png', desc: 'Papas, chocolates y dulces' },
  { nombre: 'Enlatados',     slug: 'enlatados',     img: '/images/img-8.png', desc: 'Atún, sardinas y conservas' },
]

const swiperModules = [Navigation, Pagination, Autoplay]
</script>

<template>
  <!-- Hero section -->
  <div class="text-center py-5 bg-light rounded-3 mb-4">
    <h1 class="display-4 mb-3">Bienvenido a Minisúper Variete</h1>
    <p class="lead mb-4">Tu tienda de confianza con los mejores productos y al mejor precio.</p>
    <div v-if="!isAuthenticated" class="mt-4">
      <RouterLink to="/login" class="btn btn-primary btn-lg me-3">
        <i class="fa fa-sign-in me-2"></i> Iniciar Sesión
      </RouterLink>
      <RouterLink to="/catalogo" class="btn btn-outline-secondary btn-lg">
        <i class="fa fa-tags me-2"></i> Ver Catálogo
      </RouterLink>
    </div>
    <div v-else class="mt-4">
      <p class="text-success mb-3">
        <i class="fa fa-check-circle"></i> Sesión iniciada como <strong>{{ authStore.user }}</strong>
      </p>
      <RouterLink to="/catalogo" class="btn btn-primary btn-lg">
        <i class="fa fa-tags me-2"></i> Explorar Catálogo
      </RouterLink>
    </div>
  </div>

  <!-- Acerca de -->
  <div class="about_section layout_padding">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h2 class="about_taital">Acerca de Variete</h2>
          <h3 class="about_taital_1">Minisuper "Variete"</h3>
          <p class="about_text">
            Es un mini super ubicado en la zona de la Av. de las Américas para el beneficio
            de sus clientes tanto de la zona como del resto de la población de Sucre, con
            productos variados y sobre todo económicos.
          </p>
          <RouterLink to="/catalogo" class="btn btn-outline-primary mt-3">
            Leer más <i class="fa fa-arrow-right ms-2"></i>
          </RouterLink>
        </div>
        <div class="col-md-6 text-center">
          <img src="/images/about-img.png" class="img-fluid rounded shadow" alt="Acerca de Variete" />
        </div>
      </div>
    </div>
  </div>

  <!-- Carrusel de categorías -->
  <!-- Carrusel section start -->
<div class="coffee_section layout_padding">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1 class="coffee_taital">Sobre nuestros productos</h1>
      </div>
    </div>
  </div>
  <div class="coffee_section_2">
    <Swiper
      :modules="[Navigation, Pagination, Autoplay]"
      :slides-per-view="1"
      :space-between="20"
      :loop="true"
      :navigation="true"
      :pagination="{ clickable: true }"
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      :breakpoints="{
        640: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
        1200: { slidesPerView: 4 }
      }"
      class="categorias-swiper"
    >
      <SwiperSlide v-for="cat in categorias" :key="cat.slug">
        <RouterLink :to="`/catalogo`" class="categoria-card">
          <div class="coffee_img">
            <img :src="cat.img" :alt="cat.nombre" />
          </div>
          <div class="coffee_box">
            <h3 class="types_text">- {{ cat.nombre.toUpperCase() }} -</h3>
            <p class="looking_text">{{ cat.desc }}</p>
            <span class="read_bt">Ver productos <i class="fa fa-arrow-right"></i></span>
          </div>
        </RouterLink>
      </SwiperSlide>
    </Swiper>
  </div>
</div>
<!-- Carrusel section end -->
</template>

<style scoped>
/* Tarjeta de categoría */
.categoria-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.categoria-card:hover {
  transform: translateY(-5px);
}

.categoria-card .coffee_img img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.categoria-card .coffee_box {
  padding: 15px;
  text-align: center;
}

.categorias-swiper {
  padding-bottom: 40px;
}

.categorias-swiper :deep(.swiper-button-next),
.categorias-swiper :deep(.swiper-button-prev) {
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.categorias-swiper :deep(.swiper-button-next::after),
.categorias-swiper :deep(.swiper-button-prev::after) {
  font-size: 18px;
  font-weight: bold;
}

.categorias-swiper :deep(.swiper-pagination-bullet-active) {
  background: #333;
}

/* Ajustes de Swiper */
.categorias-swiper {
  padding-bottom: 40px;
}

.categorias-swiper :deep(.swiper-button-next),
.categorias-swiper :deep(.swiper-button-prev) {
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.categorias-swiper :deep(.swiper-button-next::after),
.categorias-swiper :deep(.swiper-button-prev::after) {
  font-size: 18px;
  font-weight: bold;
}

.categorias-swiper :deep(.swiper-pagination-bullet-active) {
  background: #333;
}

/* Sección Acerca de */
.about_section {
  padding: 60px 0;
}

.about_taital {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.about_taital_1 {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 20px;
}

.about_text {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
}

.coffee_section {
  padding: 60px 0;
  background: #f8f9fa;
}

.coffee_taital {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}
</style>
