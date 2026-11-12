<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'

const ENDPOINT = 'categorias'
const categorias = ref<Categoria[]>([])
const busqueda = ref<string>('')
const categoriaDelete = ref<Categoria | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

const emit = defineEmits(['edit'])

async function obtenerLista() {
  categorias.value = await http.get(ENDPOINT).then((response) => response.data)
}

const categoriasFiltradas = computed(() => {
  return categorias.value.filter(
    (categoria) =>
      categoria.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(categoria: Categoria) {
  emit('edit', categoria)
}

function mostrarEliminarConfirm(categoria: Categoria) {
  categoriaDelete.value = categoria
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${categoriaDelete.value?.id}`)
  await obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <InputGroup>
      <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
      <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre" />
    </InputGroup>

    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(categoria, index) in categoriasFiltradas" :key="categoria.id">
          <td>{{ index + 1 }}</td>
          <td>{{ categoria.nombre }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(categoria)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(categoria)"
            />
          </td>
        </tr>
        <tr v-if="categoriasFiltradas.length === 0">
          <td colspan="3">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
