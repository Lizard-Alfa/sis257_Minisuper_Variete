<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, Tag } from 'primevue'
import type { Promocion } from '@/models/promocion'

const ENDPOINT = 'promociones'
const promociones = ref<Promocion[]>([])
const busqueda = ref<string>('')
const paginaActual = ref(1)
const filasPorPagina = ref(10)

const promoDetalle = ref<Promocion | null>(null)
const mostrarDetalle = ref<boolean>(false)
const promoCancelar = ref<Promocion | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

async function obtenerLista() {
  promociones.value = await http.get(ENDPOINT).then((response) => response.data)
}

const promocionesFiltradas = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return promociones.value.filter(
    (p) =>
      p.nombre.toLowerCase().includes(texto) ||
      p.estado.toLowerCase().includes(texto) ||
      (p.usuario?.usuario ?? '').toLowerCase().includes(texto),
  )
})

const promocionesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina.value
  return promocionesFiltradas.value.slice(inicio, inicio + filasPorPagina.value)
})

const totalPaginas = computed(
  () => Math.ceil(promocionesFiltradas.value.length / filasPorPagina.value) || 1,
)

watch(busqueda, () => (paginaActual.value = 1))

function cambiarPagina(pagina: number) {
  if (pagina >= 1 && pagina <= totalPaginas.value) paginaActual.value = pagina
}

function cambiarFilasPorPagina() {
  paginaActual.value = 1
}

function severidad(estado: string) {
  if (estado === 'activo') return 'success'
  if (estado === 'cancelado') return 'danger'
  return 'secondary'
}

function formatearPrecio(precio: number | string): string {
  return (Number(precio) || 0).toFixed(2)
}

async function verDetalle(promo: Promocion) {
  promoDetalle.value = await http.get(`${ENDPOINT}/${promo.id}`).then((res) => res.data)
  mostrarDetalle.value = true
}

function mostrarCancelarConfirm(promo: Promocion) {
  promoCancelar.value = promo
  mostrarConfirmDialog.value = true
}

async function cancelar() {
  try {
    await http.patch(`${ENDPOINT}/${promoCancelar.value?.id}/cancelar`)
    await obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

<<<<<<< HEAD
function formatearFecha(fecha: string): string {
  if (!fecha) return ''
  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

=======
>>>>>>> 8338dc273ccebca4225b019dfcc2c6c767f7571d
onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <InputGroup class="mb-3">
      <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
<<<<<<< HEAD
      <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre, estado o usuario" />
=======
      <InputText
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre, estado o usuario"
      />
>>>>>>> 8338dc273ccebca4225b019dfcc2c6c767f7571d
    </InputGroup>

    <table class="table table-striped table-hover align-middle">
      <thead class="table-dark">
        <tr>
          <th>Nro.</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Descuento</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th>Estado</th>
          <th>Creada por</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(promo, index) in promocionesPaginadas" :key="promo.id">
          <td>{{ (paginaActual - 1) * filasPorPagina + index + 1 }}</td>
          <td>{{ promo.nombre }}</td>
          <td>{{ promo.tipo === 'global' ? 'Todos los productos' : 'Seleccionados' }}</td>
          <td>{{ Number(promo.descuento) }}%</td>
<<<<<<< HEAD
          <td>{{ formatearFecha(promo.fechaInicio) }}</td>
          <td>{{ formatearFecha(promo.fechaFin) }}</td>
          <td>
            <Tag :value="promo.estado" :severity="severidad(promo.estado)" />
          </td>
          <td>{{ promo.usuario?.usuario }}</td>
          <td>
            <Button icon="pi pi-eye" aria-label="Ver productos" text @click="verDetalle(promo)" />
            <Button v-if="promo.estado === 'activo'" icon="pi pi-ban" aria-label="Cancelar" text severity="danger"
              @click="mostrarCancelarConfirm(promo)" />
=======
          <td>{{ promo.fechaInicio }}</td>
          <td>{{ promo.fechaFin }}</td>
          <td><Tag :value="promo.estado" :severity="severidad(promo.estado)" /></td>
          <td>{{ promo.usuario?.usuario }}</td>
          <td>
            <Button icon="pi pi-eye" aria-label="Ver productos" text @click="verDetalle(promo)" />
            <Button
              v-if="promo.estado === 'activo'"
              icon="pi pi-ban"
              aria-label="Cancelar"
              text
              severity="danger"
              @click="mostrarCancelarConfirm(promo)"
            />
>>>>>>> 8338dc273ccebca4225b019dfcc2c6c767f7571d
          </td>
        </tr>
        <tr v-if="promocionesPaginadas.length === 0">
          <td colspan="9" class="text-center">No se encontraron resultados</td>
        </tr>
      </tbody>
    </table>

    <!-- Paginar -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div>
        <label class="me-2">Filas por página:</label>
<<<<<<< HEAD
        <select v-model.number="filasPorPagina" @change="cambiarFilasPorPagina"
          class="form-select form-select-sm d-inline-block w-auto">
=======
        <select
          v-model.number="filasPorPagina"
          @change="cambiarFilasPorPagina"
          class="form-select form-select-sm d-inline-block w-auto"
        >
>>>>>>> 8338dc273ccebca4225b019dfcc2c6c767f7571d
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
<<<<<<< HEAD
          <li v-for="pagina in totalPaginas" :key="pagina" class="page-item"
            :class="{ active: paginaActual === pagina }">
=======
          <li
            v-for="pagina in totalPaginas"
            :key="pagina"
            class="page-item"
            :class="{ active: paginaActual === pagina }"
          >
>>>>>>> 8338dc273ccebca4225b019dfcc2c6c767f7571d
            <button class="page-link" @click="cambiarPagina(pagina)">{{ pagina }}</button>
          </li>
          <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
            <button class="page-link" @click="cambiarPagina(paginaActual + 1)">Siguiente</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Detalle: productos de la promoción -->
<<<<<<< HEAD
    <Dialog v-model:visible="mostrarDetalle" :header="`Promoción: ${promoDetalle?.nombre ?? ''}`"
      :style="{ width: '50rem' }" modal>
      <p class="mb-2">
        <strong>{{ Number(promoDetalle?.descuento) }}%</strong> del
        {{ promoDetalle?.fechaInicio }} al {{ promoDetalle?.fechaFin }}
        <Tag class="ms-2" :value="promoDetalle?.estado" :severity="severidad(promoDetalle?.estado ?? '')" />
=======
    <Dialog
      v-model:visible="mostrarDetalle"
      :header="`Promoción: ${promoDetalle?.nombre ?? ''}`"
      :style="{ width: '50rem' }"
      modal
    >
      <p class="mb-2">
        <strong>{{ Number(promoDetalle?.descuento) }}%</strong> del
        {{ promoDetalle?.fechaInicio }} al {{ promoDetalle?.fechaFin }}
        <Tag
          class="ms-2"
          :value="promoDetalle?.estado"
          :severity="severidad(promoDetalle?.estado ?? '')"
        />
>>>>>>> 8338dc273ccebca4225b019dfcc2c6c767f7571d
      </p>
      <table class="table table-sm table-striped align-middle">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Precio original</th>
            <th>Precio con descuento</th>
            <th>Ahorro</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in promoDetalle?.detalles" :key="d.id">
            <td>{{ d.producto?.codigo }}</td>
            <td>{{ d.producto?.nombre }}</td>
            <td>{{ formatearPrecio(d.precioOriginal) }}</td>
            <td>{{ formatearPrecio(d.precioDescuento) }}</td>
            <td>{{ formatearPrecio(Number(d.precioOriginal) - Number(d.precioDescuento)) }}</td>
          </tr>
        </tbody>
      </table>
    </Dialog>

    <!-- Confirmar cancelación -->
<<<<<<< HEAD
    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Cancelación" :style="{ width: '25rem' }" modal>
      <p>
        ¿Cancelar la promoción <strong>{{ promoCancelar?.nombre }}</strong>? Dejará de aplicarse en las ventas, pero se
        conserva en el historial.
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Volver" severity="secondary" @click="mostrarConfirmDialog = false" />
=======
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Cancelación"
      :style="{ width: '25rem' }"
      modal
    >
      <p>
        ¿Cancelar la promoción <strong>{{ promoCancelar?.nombre }}</strong
        >? Dejará de aplicarse en las ventas, pero se conserva en el historial.
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          label="Volver"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
>>>>>>> 8338dc273ccebca4225b019dfcc2c6c767f7571d
        <Button type="button" label="Cancelar promoción" severity="danger" @click="cancelar" />
      </div>
    </Dialog>
  </div>
<<<<<<< HEAD
</template>
=======
</template>
>>>>>>> 8338dc273ccebca4225b019dfcc2c6c767f7571d
