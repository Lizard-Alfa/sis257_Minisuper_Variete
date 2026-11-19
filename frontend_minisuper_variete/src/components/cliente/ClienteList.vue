<script setup lang="ts">
import type { Cliente } from '@/models/cliente'
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'

const ENDPOINT = 'clientes'
const clientes = ref<Cliente[]>([])
const busqueda = ref<string>('')
const clienteDelete = ref<Cliente | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  clientes.value = await http.get(ENDPOINT).then((response) => response.data)
}

const clientesFiltrados = computed(() => {
  const termino = busqueda.value.toLowerCase()
  return clientes.value.filter(
    (cliente) =>
      cliente.nitCi.toLowerCase().includes(termino) ||
      cliente.nombres.toLowerCase().includes(termino) ||
      cliente.apllidos?.toLowerCase().includes(termino) ||
      cliente.telefono?.toLowerCase().includes(termino),
  )
})

function emitirEdicion(cliente: Cliente) {
  emit('edit', cliente)
}

function mostrarEliminarConfirm(cliente: Cliente) {
  clienteDelete.value = cliente
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${clienteDelete.value?.id}`)
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
    <InputGroup class="mb-3">
      <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
      <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre, CI o teléfono" />
    </InputGroup>
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>Nro.</th>
          <th>CI</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cliente, index) in clientesFiltrados" :key="cliente.id">
          <td>{{ index + 1 }}</td>
          <td>
            <Tag :value="cliente.nitCi" severity="info" />
          </td>
          <td>{{ cliente.nombres }}</td>
          <td>{{ cliente.apllidos }}</td>
          <td>{{ cliente.telefono }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(cliente)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(cliente)"
            />
          </td>
        </tr>
        <tr v-if="clientesFiltrados.length === 0">
          <td colspan="6" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
      modal
    >
      <p>
        ¿Estás seguro de que deseas eliminar al cliente
        <strong>{{ clienteDelete?.nombres }} {{ clienteDelete?.apllidos }}</strong
        >?
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" severity="danger" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
