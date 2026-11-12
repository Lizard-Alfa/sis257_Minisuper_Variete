<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/index'

const usuario = ref('')
const clave = ref('')
const error = ref(false)
const loading = ref(false)

async function onSubmit() {
  if (!usuario.value.trim() || !clave.value.trim()) {
    error.value = true
    return
  }

  loading.value = true
  error.value = false

  const authStore = useAuthStore()
  try {
    await authStore.login(usuario.value, clave.value)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="my-5 pt-5">
    <h1 class="text-center">Iniciar Sesión</h1>
    <form class="form" @submit.prevent="onSubmit">
      <label class="form-label">Usuario:</label>
      <input v-model="usuario" type="text" class="form-input" placeholder="Usuario" autofocus :disabled="loading" />

      <label class="form-label">Contraseña:</label>
      <input v-model="clave" type="password" class="form-input" placeholder="Contraseña" :disabled="loading" />

      <p v-if="error" class="text-danger text-center mt-3">Usuario y/o contraseña incorrectos</p>

      <input type="submit" class="form-submit" :value="loading ? 'Ingresando...' : 'Ingresar'" :disabled="loading" />
    </form>
  </div>
</template>

<style>
.form {
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.form-label {
  margin-top: 2rem;
  color: white;
  margin-bottom: 0.5rem;
}
.form-input {
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid white;
  color: white;
}
.form-submit {
  background: #ee5007;
  border: none;
  border-radius: 5rem;
  color: white;
  margin-top: 3rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
}
</style>
