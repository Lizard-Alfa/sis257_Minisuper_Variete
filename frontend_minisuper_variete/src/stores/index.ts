import { defineStore } from 'pinia'
import http from '@/plugins/axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') || '',
    rol: localStorage.getItem('rol') || '',
    token: localStorage.getItem('token') || '',
    returnUrl: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.rol === 'admin',
  },

  actions: {
    async login(usuario: string, clave: string) {
      try {
        const response = await http.post('auth/login', { usuario, clave })

        this.user = response.data.usuario
        this.rol = response.data.rol
        this.token = response.data.access_token

        localStorage.setItem('user', this.user)
        localStorage.setItem('rol', this.rol)
        localStorage.setItem('token', this.token)

        router.push(this.returnUrl || '/categorias')
      } catch (error) {
        throw error
      }
    },

    logout() {
      localStorage.clear()
      this.$reset()
      router.push('/login')
    },
  },
})
