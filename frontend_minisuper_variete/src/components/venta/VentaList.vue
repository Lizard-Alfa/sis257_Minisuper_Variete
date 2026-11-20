<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputText, Select, Tag } from 'primevue'
import type { Venta } from '@/models/venta'

const ENDPOINT = 'ventas'

const ventas = ref<Venta[]>([])
const busqueda = ref<string>('')
const hoy = new Date().toLocaleDateString('en-CA')
const desde = ref<string>(hoy)
const hasta = ref<string>(hoy)
const estado = ref<string | null>(null)

const estados = [
  { label: 'Todas', value: null },
  { label: 'Activas', value: 'activa' },
  { label: 'Anuladas', value: 'anulada' },
]

const detalleVisible = ref<boolean>(false)
const ventaDetalle = ref<Venta | null>(null)

const anularVisible = ref<boolean>(false)
const ventaAnular = ref<Venta | null>(null)
const anulando = ref<boolean>(false)

async function obtenerLista() {
  try {
    const params: Record<string, string> = { desde: desde.value, hasta: hasta.value }
    if (estado.value) params.estado = estado.value
    ventas.value = await http.get(ENDPOINT, { params }).then((r) => r.data)
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al cargar las ventas')
  }
}

const ventasFiltradas = computed(() => {
  const texto = busqueda.value.trim().toLowerCase()
  if (!texto) return ventas.value
  return ventas.value.filter(
    (v) =>
      v.transaccion.toLowerCase().includes(texto) ||
      v.cliente?.nombres?.toLowerCase().includes(texto),
  )
})

const totalActivas = computed(() =>
  ventas.value.filter((v) => v.estado === 'activa').reduce((s, v) => s + Number(v.total), 0),
)

function formatoFecha(fecha: string): string {
  return new Date(fecha).toLocaleString('es-BO', { timeZone: 'America/La_Paz' })
}

async function verDetalle(venta: Venta) {
  try {
    ventaDetalle.value = await http.get(`${ENDPOINT}/${venta.id}`).then((r) => r.data)
    detalleVisible.value = true
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al cargar el detalle')
  }
}

function pedirAnular(venta: Venta) {
  ventaAnular.value = venta
  anularVisible.value = true
}

async function anular() {
  if (!ventaAnular.value) return
  anulando.value = true
  try {
    await http.patch(`${ENDPOINT}/${ventaAnular.value.id}/anular`)
    anularVisible.value = false
    detalleVisible.value = false
    await obtenerLista()
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al anular la venta')
  } finally {
    anulando.value = false
  }
}

onMounted(obtenerLista)
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2 align-items-end mb-3">
      <div class="flex flex-column">
        <label class="text-sm">Desde</label>
        <InputText v-model="desde" type="date" @change="obtenerLista" />
      </div>
      <div class="flex flex-column">
        <label class="text-sm">Hasta</label>
        <InputText v-model="hasta" type="date" @change="obtenerLista" />
      </div>
      <div class="flex flex-column">
        <label class="text-sm">Estado</label>
        <Select
          v-model="estado"
          :options="estados"
          optionLabel="label"
          appendTo="self"
          optionValue="value"
          @change="obtenerLista"
        />
      </div>
      <InputText v-model="busqueda" placeholder="Buscar transacción o cliente" class="flex-auto" />
    </div>

    <p class="mb-2">
      <strong>Total vendido (activas): Bs {{ totalActivas.toFixed(2) }}</strong>
    </p>

    <table>
      <thead>
        <tr>
          <th>Transacción</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Vendedor</th>
          <th>Pago</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in ventasFiltradas" :key="v.id">
          <td>{{ formatoFecha(v.fechaCreacion) }}</td>
          <td>{{ v.cliente?.nombres }}</td>
          <td>{{ v.usuario?.usuario }}</td>
          <td class="text-capitalize">{{ v.metodoPago }}</td>
          <td>Bs {{ Number(v.total).toFixed(2) }}</td>
          <td>
            <Tag
              :value="v.estado === 'activa' ? 'Activa' : 'Anulada'"
              :severity="v.estado === 'activa' ? 'success' : 'danger'"
              
            />
          </td>
          <td>
            <Button
              icon="pi pi-eye"
              label="Ver más detalle"
              text
              size="small"
              @click="verDetalle(v)"
            />
            <Button
              icon="pi pi-ban"
              label="Anular"
              text
              size="small"
              severity="danger"
              :disabled="v.estado === 'anulada'"
              @click="pedirAnular(v)"
            />
          </td>
        </tr>
        <tr v-if="ventasFiltradas.length === 0">
          <td colspan="8">No se encontraron ventas</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de detalle -->
    <Dialog
      v-model:visible="detalleVisible"
      :header="`Venta ${ventaDetalle?.transaccion ?? ''}`"
      :style="{ width: '42rem' }"
      modal
    >
      <div v-if="ventaDetalle">
        <div class="grid mb-3">
          <div class="col-6">
            <strong>Fecha:</strong> {{ formatoFecha(ventaDetalle.fechaCreacion) }}
          </div>
          <div class="col-6">
            <strong>Estado:</strong>
            <Tag
              class="ml-2"
              :value="ventaDetalle.estado === 'activa' ? 'Activa' : 'Anulada'"
              :severity="ventaDetalle.estado === 'activa' ? 'success' : 'danger'"
            />
          </div>
          <div class="col-6"><strong>Cliente:</strong> {{ ventaDetalle.cliente?.nombres }}</div>
          <div class="col-6"><strong>Vendedor:</strong> {{ ventaDetalle.usuario?.usuario }}</div>
          <div class="col-6">
            <strong>Pago:</strong>
            <span class="text-capitalize">{{ ventaDetalle.metodoPago }}</span>
          </div>
          <div class="col-6" v-if="ventaDetalle.observaciones">
            <strong>Observaciones:</strong> {{ ventaDetalle.observaciones }}
          </div>
        </div>

        <table class="w-full">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Descuento</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in ventaDetalle.detalles" :key="d.id">
              <td>{{ d.producto?.nombre }}</td>
              <td>{{ d.cantidad }}</td>
              <td>Bs {{ Number(d.precioUnitario).toFixed(2) }}</td>
              <td>Bs {{ Number(d.descuentoMonto).toFixed(2) }}</td>
              <td>Bs {{ Number(d.subtotal).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <p class="text-right text-xl mt-3">
          <strong>Total: Bs {{ Number(ventaDetalle.total).toFixed(2) }}</strong>
        </p>
      </div>

      <div class="flex justify-end gap-2 mt-3">
        <Button label="Cerrar" severity="secondary" @click="detalleVisible = false" />
        <Button
          v-if="ventaDetalle?.estado === 'activa'"
          label="Anular venta"
          icon="pi pi-ban"
          severity="danger"
          @click="pedirAnular(ventaDetalle!)"
        />
      </div>
    </Dialog>

    <!-- Confirmación de anulación -->
    <Dialog
      v-model:visible="anularVisible"
      header="Confirmar anulación"
      :style="{ width: '25rem' }"
      modal
    >
      <p>
        ¿Anular la venta <strong>{{ ventaAnular?.transaccion }}</strong
        >? Se devolverá el stock de los productos. Esta acción no se puede deshacer.
      </p>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="anularVisible = false" />
        <Button label="Anular" severity="danger" :loading="anulando" @click="anular" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
