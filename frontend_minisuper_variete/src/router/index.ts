import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/index'
import { getTokenFromLocalStorage } from '@/helpers/index.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/catalogo',
      name: 'catalogo',
      component: () => import('../views/CatalogoView.vue'),
      meta: { public: true },
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriasView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/productos',
      name: 'productos',
      component: () => import('../views/ProductosView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/proveedores',
      name: 'proveedores',
      component: () => import('../views/ProveedoresView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('../views/ClientesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/ventas/nueva',
      name: 'ventas-nueva',
      component: () => import('@/views/VentaNuevaView.vue'),
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('@/views/VentaListView.vue'),
    },
    {
      path: '/promociones',
      name: 'promociones',
      component: () => import('@/views/PromocionView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const publicPages = [, '/catalogo', '/login', '/']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !getTokenFromLocalStorage()) {
    if (authStore) authStore.logout()
    authStore.returnUrl = to.fullPath
    return '/login'
  }
})

export default router
