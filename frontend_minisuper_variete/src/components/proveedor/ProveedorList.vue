<script setup lang="ts">
import type { Proveedor } from '@/models/proveedor'
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'

const ENDPOINT = 'proveedores'
const proveedores = ref<Proveedor[]>([])
const busqueda = ref<string>('')
const proveedorDelete = ref<Proveedor | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

const emit = defineEmits(['edit'])

async function obtenerLista() {
  proveedores.value = await http.get(ENDPOINT).then((response) => response.data)
}

const proveedoresFiltrados = computed(() => {
  const termino = busqueda.value.toLowerCase()
  return proveedores.value.filter(
    (proveedor) =>
      proveedor.nombres.toLowerCase().includes(termino) ||
      proveedor.apellidos.toLowerCase().includes(termino) ||
      proveedor.nitCi.toLowerCase().includes(termino) ||
      proveedor.email.toLowerCase().includes(termino) ||
      proveedor.telefono.toLowerCase().includes(termino),
  )
})

function emitirEdicion(proveedor: Proveedor) {
  emit('edit', proveedor)
}

function mostrarEliminarConfirm(proveedor: Proveedor) {
  proveedorDelete.value = proveedor
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${proveedorDelete.value?.id}`)
  await obtenerLista()
  mostrarConfirmDialog.value = false
}

function nombreCompleto(proveedor: Proveedor): string {
  return `${proveedor.nombres} ${proveedor.apellidos}`.trim()
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
      <InputText
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre, NIT/CI, email o teléfono"
      />
    </InputGroup>

    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>Nro.</th>
          <th>NIT/CI</th>
          <th>Nombre Completo</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(proveedor, index) in proveedoresFiltrados" :key="proveedor.id">
          <td>{{ index + 1 }}</td>
          <td>
            <Tag :value="proveedor.nitCi" severity="info" />
          </td>
          <td>{{ nombreCompleto(proveedor) }}</td>
          <td>{{ proveedor.telefono }}</td>
          <td>{{ proveedor.direccion }}</td>
          <td>{{ proveedor.email }}</td>
          <td>
            <Button
              icon="pi pi-pencil"
              aria-label="Editar"
              text
              @click="emitirEdicion(proveedor)"
            />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(proveedor)"
            />
          </td>
        </tr>
        <tr v-if="proveedoresFiltrados.length === 0">
          <td colspan="7" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>
        ¿Estás seguro de que deseas eliminar al proveedor
        <strong>{{ proveedorDelete ? nombreCompleto(proveedorDelete) : '' }}</strong>?
      </p>
      <div class="flex justify-end gap-2">
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
