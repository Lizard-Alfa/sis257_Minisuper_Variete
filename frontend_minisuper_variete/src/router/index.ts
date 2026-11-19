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
    /*{
      path: '/historial-ventas',
      name: 'historial-ventas',
      component: () => import('../views/HistorialVentasView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/VentasView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },*/
  ],
})

router.beforeEach(async (to) => {
  const publicPages = [,'/catalogo','/login', '/']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !getTokenFromLocalStorage()) {
    if (authStore) authStore.logout()
    authStore.returnUrl = to.fullPath
    return '/login'
  }
})

export default router
