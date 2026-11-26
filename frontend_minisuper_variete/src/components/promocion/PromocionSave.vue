<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import {
  Button,
  Checkbox,
  DatePicker,
  Dialog,
  InputGroup,
  InputGroupAddon,
  InputNumber,
  InputText,
  ToggleSwitch,
} from 'primevue'
import type { Producto } from '@/models/producto'

const ENDPOINT = 'promociones'
const props = defineProps({ mostrar: Boolean })
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const nombre = ref<string>('')
const descuento = ref<number | null>(10)
const fechaInicio = ref<Date | null>(null)
const fechaFin = ref<Date | null>(null)
const aplicarATodos = ref<boolean>(false)

const productos = ref<Producto[]>([])
const seleccionados = ref<number[]>([])
const busqueda = ref<string>('')

const mostrarResultado = ref<boolean>(false)
const resultado = ref<{
  aplicados: number
  omitidos: { id: number; codigo: string; nombre: string }[]
} | null>(null)

const productosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()
  return productos.value.filter(
    (p) => p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto),
  )
})

// Casilla "seleccionar todos" (solo los que se ven según el buscador)
const todosMarcados = computed({
  get: () =>
    productosFiltrados.value.length > 0 &&
    productosFiltrados.value.every((p) => seleccionados.value.includes(p.id)),
  set: (marcar: boolean) => {
    const idsFiltrados = productosFiltrados.value.map((p) => p.id)
    if (marcar) {
      seleccionados.value = [...new Set([...seleccionados.value, ...idsFiltrados])]
    } else {
      seleccionados.value = seleccionados.value.filter((id) => !idsFiltrados.includes(id))
    }
  },
})

watch(
  () => props.mostrar,
  async (nuevoValor) => {
    if (!nuevoValor) return
    nombre.value = ''
    descuento.value = 10
    fechaInicio.value = null
    fechaFin.value = null
    aplicarATodos.value = false
    seleccionados.value = []
    busqueda.value = ''
    productos.value = await http.get('productos').then((res) => res.data)
  },
)

// YYYY-MM-DD con la fecha local (evita el corrimiento de día de toISOString)
function formatearFecha(f: Date): string {
  const y = f.getFullYear()
  const m = String(f.getMonth() + 1).padStart(2, '0')
  const d = String(f.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function handleSave() {
  if (!nombre.value.trim()) return alert('El nombre es obligatorio')
  if (!descuento.value || descuento.value < 1 || descuento.value > 100)
    return alert('El descuento debe estar entre 1 y 100')
  if (!fechaInicio.value || !fechaFin.value) return alert('Selecciona fecha de inicio y fin')
  if (fechaFin.value < fechaInicio.value)
    return alert('La fecha fin no puede ser menor que la fecha inicio')
  if (!aplicarATodos.value && seleccionados.value.length === 0)
    return alert('Selecciona al menos un producto o aplica a todos')

  try {
    const body: any = {
      nombre: nombre.value.trim(),
      descuento: descuento.value,
      fechaInicio: formatearFecha(fechaInicio.value),
      fechaFin: formatearFecha(fechaFin.value),
      aplicarATodos: aplicarATodos.value,
    }
    if (!aplicarATodos.value) body.idProductos = seleccionados.value

    const data = await http.post(ENDPOINT, body).then((res) => res.data)

    emit('guardar')
    dialogVisible.value = false

    if (data.omitidos?.length) {
      resultado.value = { aplicados: data.aplicados, omitidos: data.omitidos }
      mostrarResultado.value = true
    }
  } catch (error: any) {
    const data = error?.response?.data
    if (data?.omitidos?.length) {
      resultado.value = { aplicados: 0, omitidos: data.omitidos }
      mostrarResultado.value = true
    } else {
      const msg = data?.message
      alert(Array.isArray(msg) ? msg.join('\n') : msg)
    }
  }
}
</script>

<template>
  <div>
    <Dialog v-model:visible="dialogVisible" header="Nueva Promoción" style="width: 45rem" modal>
      <div class="flex flex-column gap-3">
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-2">
            <label for="nombre" class="font-semibold">Nombre *</label>
            <InputText id="nombre" v-model="nombre" :maxlength="50" autocomplete="off" />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="descuento" class="font-semibold">Descuento (%) *</label>
            <InputNumber
              inputId="descuento"
              v-model="descuento"
              suffix="%"
              :min="1"
              :max="100"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="fechaInicio" class="font-semibold">Fecha inicio *</label>
            <DatePicker
              inputId="fechaInicio"
              v-model="fechaInicio"
              dateFormat="dd/mm/yy"
              showIcon
              class="w-full"
              appendTo="self"
            />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="fechaFin" class="font-semibold">Fecha fin *</label>
            <DatePicker
              inputId="fechaFin"
              v-model="fechaFin"
              dateFormat="dd/mm/yy"
              :minDate="fechaInicio ?? undefined"
              showIcon
              class="w-full"
              appendTo="self"
            />
          </div>
        </div>

        <div class="flex align-items-center gap-2">
          <ToggleSwitch v-model="aplicarATodos" inputId="aplicarATodos" />
          <label for="aplicarATodos" class="font-semibold">Aplicar a todos los productos</label>
        </div>

        <!-- Selección de productos -->
        <div v-if="!aplicarATodos">
          <InputGroup class="mb-2">
            <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
            <InputText v-model="busqueda" placeholder="Buscar producto por nombre o código" />
          </InputGroup>

          <div style="max-height: 18rem; overflow-y: auto">
            <table class="table table-sm table-hover align-middle mb-0">
              <thead class="table-dark" style="position: sticky; top: 0">
                <tr>
                  <th style="width: 3rem"><Checkbox v-model="todosMarcados" binary /></th>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in productosFiltrados" :key="p.id">
                  <td><Checkbox v-model="seleccionados" :value="p.id" /></td>
                  <td>{{ p.codigo }}</td>
                  <td>{{ p.nombre }}</td>
                  <td>{{ Number(p.precio).toFixed(2) }}</td>
                </tr>
                <tr v-if="productosFiltrados.length === 0">
                  <td colspan="4" class="text-center">No se encontraron productos</td>
                </tr>
              </tbody>
            </table>
          </div>
          <small>{{ seleccionados.length }} producto(s) seleccionado(s)</small>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>

    <!-- Resultado: productos que se omitieron por tener otra promo -->
    <Dialog
      v-model:visible="mostrarResultado"
      header="Productos omitidos"
      :style="{ width: '30rem' }"
      modal
    >
      <p v-if="resultado?.aplicados">
        Promoción creada en <strong>{{ resultado.aplicados }}</strong> producto(s).
      </p>
      <p>
        Estos productos <strong>no se incluyeron</strong> porque ya tienen otra promoción en esas
        fechas:
      </p>
      <ul style="max-height: 14rem; overflow-y: auto">
        <li v-for="o in resultado?.omitidos" :key="o.id">{{ o.codigo }} - {{ o.nombre }}</li>
      </ul>
      <div class="flex justify-end mt-3">
        <Button label="Entendido" @click="mostrarResultado = false" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-inputtext) {
  color: #121212 !important;
}
:deep(.p-inputnumber-input) {
  color: #0c0c0c !important;
}
</style>
