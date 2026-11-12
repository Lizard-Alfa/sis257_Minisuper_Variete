<script setup lang="ts">
import type { Producto } from '@/models/producto'
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'

const ENDPOINT = 'productos'
const productos = ref<Producto[]>([])
const busqueda = ref<string>('')
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

const emit = defineEmits(['edit'])

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((response) => response.data)
}

const productosFiltrados = computed(() => {
  return productos.value.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.categoria?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      `${producto.proveedor?.nombres} ${producto.proveedor?.apellidos}`
        .toLowerCase()
        .includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(producto: Producto) {
  emit('edit', producto)
}

function mostrarEliminarConfirm(producto: Producto) {
  productoDelete.value = producto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
  await obtenerLista()
  mostrarConfirmDialog.value = false
}

function formatearPrecio(precio: number): string {
  return precio?.toFixed(2) ?? '0.00'
}

function nombreProveedor(proveedor: any): string {
  if (!proveedor) return 'N/A'
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
        placeholder="Buscar por nombre, código, categoría o proveedor"
      />
    </InputGroup>

    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>Nro.</th>
          <th>Código</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Proveedor</th>
          <th>Precio</th>
          <th>Unidad</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in productosFiltrados" :key="producto.id">
          <td>{{ index + 1 }}</td>
          <td>{{ producto.codigo }}</td>
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.categoria?.nombre ?? 'N/A' }}</td>
          <td>{{ nombreProveedor(producto.proveedor) }}</td>
          <td class="text-end">Bs. {{ formatearPrecio(producto.precio) }}</td>
          <td>{{ producto.unidad_medida }}</td>
          <td>
            <Tag
              :value="producto.estado ? 'Activo' : 'Inactivo'"
              :severity="producto.estado ? 'success' : 'danger'"
            />
          </td>
          <td>
            <Button
              icon="pi pi-pencil"
              aria-label="Editar"
              text
              @click="emitirEdicion(producto)"
            />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(producto)"
            />
          </td>
        </tr>
        <tr v-if="productosFiltrados.length === 0">
          <td colspan="9" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>
        ¿Estás seguro de que deseas eliminar el producto
        <strong>{{ productoDelete?.nombre }}</strong>?
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
