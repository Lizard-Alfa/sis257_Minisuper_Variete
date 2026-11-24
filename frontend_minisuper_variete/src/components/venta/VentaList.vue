<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { Button, Column, DataTable, Dialog, InputText, Select, Tag } from 'primevue'
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
  return fecha ? new Date(fecha).toLocaleDateString('es-BO', { timeZone: 'America/La_Paz' }) : ''
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

    <DataTable :value="ventasFiltradas" dataKey="id" responsiveLayout="scroll">
      <template #empty>No se encontraron ventas</template>

      <Column field="fechaCreacion" header="Fecha">
        <template #body="{ data }">
          {{ formatoFecha(data.fechaCreacion) }}
        </template>
      </Column>

      <Column field="cliente.nombres" header="Cliente">
        <template #body="{ data }">
          {{ data.cliente?.nombres }}
        </template>
      </Column>

      <Column field="usuario.usuario" header="Vendedor">
        <template #body="{ data }">
          {{ data.usuario?.usuario }}
        </template>
      </Column>

      <Column field="metodoPago" header="Pago">
        <template #body="{ data }">
          <span class="text-capitalize">{{ data.metodoPago }}</span>
        </template>
      </Column>

      <Column field="total" header="Total">
        <template #body="{ data }"> Bs {{ Number(data.total).toFixed(2) }} </template>
      </Column>

      <Column field="estado" header="Estado">
        <template #body="{ data }">
          <Tag
            :value="data.estado === 'activa' ? 'Activa' : 'Anulada'"
            :severity="data.estado === 'activa' ? 'success' : 'danger'"
          />
        </template>
      </Column>

      <Column header="Acciones">
        <template #body="{ data }">
          <Button
            icon="pi pi-eye"
            label="Ver más detalle"
            text
            size="small"
            @click="verDetalle(data)"
          />
          <Button
            icon="pi pi-ban"
            label="Anular"
            text
            size="small"
            severity="danger"
            :disabled="data.estado === 'anulada'"
            @click="pedirAnular(data)"
          />
        </template>
      </Column>
    </DataTable>

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
