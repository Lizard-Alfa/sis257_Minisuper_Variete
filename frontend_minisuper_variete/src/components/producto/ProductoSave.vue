<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText, Select, DatePicker } from 'primevue'
import type { Producto } from '@/models/producto'
import type { Categoria } from '@/models/categoria'
import type { Proveedor } from '@/models/proveedor'

const ENDPOINT = 'productos'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close'])

const producto = ref<Producto>({
  ...(props.producto || {}),
  categoria: props.producto?.categoria ?? { id: 0 },
  proveedor: props.producto?.proveedor ?? { id: 0 },
} as Producto)

watch(
  () => props.producto,
  (newVal) => {
    producto.value = {
      ...(newVal || {}),
      categoria: newVal?.categoria ?? { id: 0 },
      proveedor: newVal?.proveedor ?? { id: 0 },
    } as Producto
  },
)

const categorias = ref<Categoria[]>([])
const proveedores = ref<Proveedor[]>([])

const unidadesMedida = [
  { label: 'Unidad', value: 'Unidad' },
  { label: 'Kilogramo (kg)', value: 'kg' },
  { label: 'Gramo (g)', value: 'g' },
  { label: 'Litro (L)', value: 'L' },
  { label: 'Mililitro (ml)', value: 'ml' },
  { label: 'Metro (m)', value: 'm' },
  { label: 'Caja', value: 'Caja' },
  { label: 'Paquete', value: 'Paquete' },
]

async function obtenerCategorias() {
  categorias.value = await http.get('categorias').then((res) => res.data)
}

async function obtenerProveedores() {
  proveedores.value = await http.get('proveedores').then((res) => res.data)
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerCategorias()
      obtenerProveedores()

      if (props.producto?.id) {
        producto.value = {
          ...props.producto,
          categoria: props.producto.categoria ?? { id: 0 },
          proveedor: props.producto.proveedor ?? { id: 0 },
        }
      } else {
        producto.value = {
          id: 0,
          categoria: { id: 0 },
          proveedor: { id: 0 },
        } as unknown as Producto
      }
    }
  },
)

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

async function handleSave() {
  try {
    if (!producto.value.codigo) {
      alert('El código es obligatorio')
      return
    }
    if (!producto.value.nombre) {
      alert('El nombre es obligatorio')
      return
    }
    if (!producto.value.categoria?.id) {
      alert('Debe seleccionar una categoría')
      return
    }
    if (producto.value.precio <= 0) {
      alert('El precio debe ser mayor a 0')
      return
    }
    if (!producto.value.unidadMedida) {
      alert('La unidad de medida es obligatoria')
      return
    }

    const body = {
      codigo: producto.value.codigo,
      nombre: producto.value.nombre,
      idCategoria: producto.value.categoria?.id,
      idProveedor: producto.value.proveedor?.id,
      imagen: producto.value.imagen,
      unidadMedida: producto.value.unidadMedida,
      stock: Number(producto.value.stock),
      stockMinimo: Number(producto.value.stockMinimo),
      precio: Number(producto.value.precio),
      precioDescuento: Number(producto.value.precioDescuento),
      descuentoInicio: producto.value.descuentoInicio||null,
      descuentoFin: producto.value.descuentoFin||null,
    }

    if (props.modoEdicion && producto.value.id) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    producto.value = {} as Producto
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Producto' : 'Nuevo Producto'"
      :style="{ width: '40rem' }"
      modal
    >
      <div class="flex flex-column gap-3">
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="codigo" class="font-semibold">Código *</label>
            <InputText
              id="codigo"
              v-model="producto.codigo"
              maxlength="20"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-column gap-2 flex-2">
            <label for="nombre" class="font-semibold">Nombre *</label>
            <InputText id="nombre" v-model="producto.nombre" maxlength="100" autocomplete="off" />
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="categoria" class="font-semibold">Categoría *</label>
            <Select
              id="categoria"
              v-model="producto.categoria.id"
              :options="categorias"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione una categoría"
              class="w-full"
            />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="proveedor" class="font-semibold">Proveedor (opcional)</label>
            <Select
              id="proveedor"
              v-model="producto.proveedor.id"
              :options="proveedores"
              optionLabel="nombres"
              optionValue="id"
              placeholder="Seleccione un proveedor"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex flex-column gap-2">
          <label for="imagen" class="font-semibold">URL de Imagen (opcional)</label>
          <InputText
            id="imagen"
            v-model="producto.imagen"
            placeholder="https://ejemplo.com/imagen.jpg"
            autocomplete="off"
          />
          <small v-if="producto.imagen" class="text-color-secondary">
            Vista previa:
            <img
              :src="producto.imagen"
              alt="Vista previa"
              style="
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 4px;
                margin-top: 5px;
              "
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            />
          </small>
        </div>

        <div class="flex flex-column gap-2 flex-1">
          <label for="unidadMedida" class="font-semibold">Unidad de Medida *</label>
          <Select
            id="unidadMedida"
            v-model="producto.unidadMedida"
            :options="unidadesMedida"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione una unidad"
            class="w-full"
          />
        </div>

        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="stock" class="font-semibold">Stock *</label>
            <InputNumber id="stock" v-model="producto.stock" class="w-full" :min="0" />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="stockMinimo" class="font-semibold">Stock Mínimo *</label>
            <InputNumber id="stockMinimo" v-model="producto.stockMinimo" class="w-full" :min="0" />
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="precio" class="font-semibold">Precio (Bs.) *</label>
            <InputNumber
              id="precio"
              v-model="producto.precio"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :min="0"
              locale="es-BO"
              class="w-full"
            />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="precioDescuento" class="font-semibold">Precio con Descuento</label>
            <InputNumber
              id="precioDescuento"
              v-model="producto.precioDescuento"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :min="0"
              locale="es-BO"
              class="w-full"
            />
          </div>
        </div>

        <!-- Fechas de descuento -->
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="descuentoInicio" class="font-semibold">Fecha Inicio Descuento</label>
            <DatePicker
              id="descuentoInicio"
              v-model="producto.descuentoInicio"
              dateFormat="yy-mm-dd"
              showIcon
              showClearButton
              placeholder="Seleccione fecha"
              class="w-full"
            />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="descuentoFin" class="font-semibold">Fecha Fin Descuento</label>
            <DatePicker
              id="descuentoFin"
              v-model="producto.descuentoFin"
              dateFormat="yy-mm-dd"
              showIcon
              showClearButton
              placeholder="Seleccione fecha"
              class="w-full"
            />
          </div>
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
  </div>
</template>

<style scoped>
:deep(.p-select-label) {
  color: #131313 !important;
}
:deep(.p-select-option) {
  color: #413f3f !important;
}
:deep(.p-inputtext) {
  color: #121212 !important;
}
:deep(.p-inputnumber-input) {
  color: #0c0c0c !important;
}
</style>