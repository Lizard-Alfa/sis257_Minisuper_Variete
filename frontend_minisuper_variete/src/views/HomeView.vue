<script setup lang="ts">
import { useAuthStore } from '@/stores/index'
import { computed } from 'vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.token)
</script>

<template>
  <div class="text-center py-5">
    <h1 class="display-4 mb-4">Bienvenido a Minisúper Variete</h1>
    <p class="lead mb-4">Tu tienda de confianza con los mejores productos y al mejor precio.</p>

    <div v-if="!isAuthenticated" class="mt-5">
      <RouterLink to="/login" class="btn btn-primary btn-lg me-3">
        <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
      </RouterLink>
      <RouterLink to="/catalogo" class="btn btn-outline-secondary btn-lg">
        <i class="bi bi-tags"></i> Ver Catalogo
      </RouterLink>
    </div>

    <div v-else class="mt-5">
      <p class="text-success">
        <i class="bi bi-check-circle"></i> Sesión iniciada como
        <strong>{{ authStore.user }}</strong>
      </p>
      <RouterLink to="/catalogo" class="btn btn-primary btn-lg">
        <i class="bi bi-tags"></i> Explorar Catalogo
      </RouterLink>
    </div>
  </div>

  <!-- about section start -->
  <div class="about_section layout_padding">
    <div class="container">
      <div class="about_section_2">
        <div class="row">
          <div class="col-md-6">
            <div class="about_taital_box">
              <h1 class="about_taital">Acerca de Variete</h1>
              <h1 class="about_taital_1">Minisuper "Variete"</h1>
              <p class="about_text">
                Es un mini super que se encuentra ubicado en la zona de la Av. de las Americas para
                el beneficio de su cliente tanto de la zona como el resto de la población de Sucre
                con productos variados y sobre todo economicos.
              </p>
              <div class="readmore_btn"><a href="#">Leer mas</a></div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="image_iman"><img src="/images/about-img.png" class="about_img" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- about section end -->

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
      <div id="main_slider" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-1.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">- ABARROTES -</h3>
                    <p class="looking_text">El producto mas popular es...</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-2.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">- BEBIDAS -</h3>
                    <p class="looking_text">El producto mas popular es...</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-3.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">- LÁCTEOS -</h3>
                    <p class="looking_text">El producto mas popular es...</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-4.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">- LIMPIEZA -</h3>
                    <p class="looking_text">El producto mas popular es...</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="carousel-item">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-1.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">TYPES OF COFFEE</h3>
                    <p class="looking_text">looking at its layout. The point of</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-2.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">BEAN VARIETIES</h3>
                    <p class="looking_text">looking at its layout. The point of</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-3.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">COFFEE & PASTRY</h3>
                    <p class="looking_text">looking at its layout. The point of</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-4.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">COFFEE TO GO</h3>
                    <p class="looking_text">looking at its layout. The point of</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="carousel-item">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-1.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">TYPES OF COFFEE</h3>
                    <p class="looking_text">looking at its layout. The point of</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-2.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">BEAN VARIETIES</h3>
                    <p class="looking_text">looking at its layout. The point of</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-3.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">COFFEE & PASTRY</h3>
                    <p class="looking_text">looking at its layout. The point of</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="coffee_img"><img src="/images/img-4.png" /></div>
                  <div class="coffee_box">
                    <h3 class="types_text">COFFEE TO GO</h3>
                    <p class="looking_text">looking at its layout. The point of</p>
                    <div class="read_bt"><a href="#">Saber mas</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a class="carousel-control-prev" href="#main_slider" role="button" data-slide="prev">
          <i class="fa fa-arrow-left"></i>
        </a>
        <a class="carousel-control-next" href="#main_slider" role="button" data-slide="next">
          <i class="fa fa-arrow-right"></i>
        </a>
      </div>
    </div>
  </div>
  <!-- Carrusel section end -->
</template>
