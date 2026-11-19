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
const paginaActual = ref(1)
const filasPorPagina = ref(10)
const emit = defineEmits(['edit'])

async function obtenerLista() {
  proveedores.value = await http.get(ENDPOINT).then((response) => response.data)
}

const proveedoresFiltrados = computed(() => {
  const termino = busqueda.value.toLowerCase()
  return proveedores.value.filter(
    (proveedor) =>
      proveedor.nombres.toLowerCase().includes(termino) ||
      proveedor.razonSocial.toLowerCase().includes(termino) ||
      proveedor.nitCi.toLowerCase().includes(termino) ||
      proveedor.email.toLowerCase().includes(termino) ||
      proveedor.telefono.toLowerCase().includes(termino),
  )
})

const proveedoresPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina.value
  const fin = inicio + filasPorPagina.value
  return proveedoresFiltrados.value.slice(inicio, fin)
})

const totalPaginas = computed(() =>
  Math.ceil(proveedoresFiltrados.value.length / filasPorPagina.value) || 1,
)

function cambiarPagina(pagina: number) {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
  }
}

function cambiarFilasPorPagina() {
  paginaActual.value = 1
}

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
          <th>Razon Social</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(proveedor, index) in proveedoresPaginados" :key="proveedor.id">
          <td>{{ (paginaActual - 1) * filasPorPagina + index + 1 }}</td>
          <td><Tag :value="proveedor.nitCi" severity="info" /></td>
          <td>{{ proveedor.nombres }}</td>
            <td>{{ proveedor.razonSocial }}</td>
          <td>{{ proveedor.telefono }}</td>
          <td>{{ proveedor.direccion }}</td>
          <td>{{ proveedor.email }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(proveedor)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              severity="danger"
              @click="mostrarEliminarConfirm(proveedor)"
            />
          </td>
        </tr>
        <tr v-if="proveedoresPaginados.length === 0">
          <td colspan="7" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
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

    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar al proveedor <strong>{{ proveedorDelete?.nombres}}</strong>?</p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button type="button" label="Eliminar" severity="danger" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>
