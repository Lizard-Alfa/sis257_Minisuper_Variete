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
const paginaActual = ref(1)
const filasPorPagina = ref(10)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((response) => response.data)
}

const productosFiltrados = computed(() => {
  return productos.value.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.categoria.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      producto.proveedor.nombres.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

const productosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina.value
  const fin = inicio + filasPorPagina.value
  return productosFiltrados.value.slice(inicio, fin)
})

const totalPaginas = computed(
  () => Math.ceil(productosFiltrados.value.length / filasPorPagina.value) || 1,
)

function cambiarPagina(pagina: number) {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
  }
}

function cambiarFilasPorPagina() {
  paginaActual.value = 1
}

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

function formatearPrecio(precio: number | string): string {
  const precioNum = typeof precio === 'string' ? parseFloat(precio) : precio
  return precioNum?.toFixed(2) ?? '0.00'
}

function nombreProveedor(proveedor: any): string {
  if (!proveedor) return 'N/A'
  return `${proveedor.nombres} ${proveedor.apellidos}`.trim()
}

function obtenerImagen(producto: Producto): string {
  return producto.imagen || 'https://via.placeholder.com/60x60?text=Sin+Imagen'
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
    <table class="table table-striped table-hover align-middle tabla-productos">
      <thead class="table-dark">
        <tr>
          <th>Nro.</th>
          <th>Imagen</th>
          <th>Código</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Proveedor</th>
          <th>Unidad de Medida</th>
          <th>Stock</th>
          <th>Descuento(%)</th>
          <th>Precio</th>
          <th>Precio con descuento</th>
          <th>Descuento Inicio</th>
          <th>Descuento Fin</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in productosPaginados" :key="producto.id">
          <td>{{ (paginaActual - 1) * filasPorPagina + index + 1 }}</td>
          <td>
            <img
              :src="obtenerImagen(producto)"
              :alt="producto.nombre"
              style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px"
            />
          </td>
          <td>{{ producto.codigo }}</td>
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.categoria?.nombre }}</td>
          <td>{{ producto.proveedor?.nombres }}</td>
          <td>{{ producto.unidadMedida }}</td>
          <td>{{ producto.stock }}</td>
          <td>{{ producto.stockMinimo }}</td>
          <td>{{ producto.precio }}</td>
          <td>{{ producto.precioDescuento }}</td>
          <td>{{ producto.descuentoInicio }}</td>
          <td>{{ producto.descuentoFin }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(producto)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(producto)"
            />
          </td>
        </tr>
        <tr v-if="productosPaginados.length === 0">
          <td colspan="14" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>
    <!-- Paginar -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div>
        <label class="me-2">Filas por página:</label>
        <select
          v-model.number="filasPorPagina"
          @change="cambiarFilasPorPagina"
          class="form-select form-select-sm d-inline-block w-auto"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
      </div>
      <nav>
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: paginaActual === 1 }">
            <button class="page-link" @click="cambiarPagina(paginaActual - 1)">Anterior</button>
          </li>
          <li
            v-for="pagina in totalPaginas"
            :key="pagina"
            class="page-item"
            :class="{ active: paginaActual === pagina }"
          >
            <button class="page-link" @click="cambiarPagina(pagina)">{{ pagina }}</button>
          </li>
          <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
            <button class="page-link" @click="cambiarPagina(paginaActual + 1)">Siguiente</button>
          </li>
        </ul>
      </nav>
    </div>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
      modal
    >
      <p>
        ¿Estás seguro de que deseas eliminar el producto
        <strong>{{ productoDelete?.nombre }}</strong
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
<style></style>
