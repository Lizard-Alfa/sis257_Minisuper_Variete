<script setup lang="ts">
import type { Categoria, Producto } from '@/models/producto'
import { computed, onMounted, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputNumber, InputText, Select } from 'primevue'

const ENDPOINT = 'productos'

interface ProveedorOption {
  id: number
  nitCi: string
  nombres: string
  apellidos: string
}

const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto | null,
    default: () => null,
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close'])

const form = ref({
  codigo: '',
  nombre: '',
  precio: 0,
  unidad_medida: '',
  idCategoria: null as number | null,
  nitCiProveedor: '',
})

const categorias = ref<Categoria[]>([])
const proveedores = ref<ProveedorOption[]>([])

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

async function cargarCategorias() {
  categorias.value = await http.get('categorias').then((r) => r.data)
}

async function cargarProveedores() {
  proveedores.value = await http.get('proveedores').then((r) => r.data)
}

watch(
  () => props.mostrar,
  async (visible) => {
    if (visible) {
      await Promise.all([cargarCategorias(), cargarProveedores()])

      if (props.modoEdicion && props.producto) {
        form.value = {
          codigo: props.producto.codigo ?? '',
          nombre: props.producto.nombre ?? '',
          precio: props.producto.precio ?? 0,
          unidad_medida: props.producto.unidad_medida ?? '',
          idCategoria: props.producto.categoria?.id ?? null,
          nitCiProveedor: props.producto.proveedor?.nitCi ?? '',
        }
      } else {
        resetForm()
      }
    }
  },
)

function resetForm() {
  form.value = {
    codigo: '',
    nombre: '',
    precio: 0,
    unidad_medida: '',
    idCategoria: null,
    nitCiProveedor: '',
  }
}

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

async function handleSave() {
  try {

    if (!form.value.codigo?.trim()) {
      alert('El código es obligatorio')
      return
    }
    if (!form.value.nombre?.trim()) {
      alert('El nombre es obligatorio')
      return
    }
    if (!form.value.idCategoria) {
      alert('Debe seleccionar una categoría')
      return
    }
    if (!form.value.nitCiProveedor) {
      alert('Debe seleccionar un proveedor')
      return
    }
    if (form.value.precio <= 0) {
      alert('El precio debe ser mayor a 0')
      return
    }
    if (!form.value.unidad_medida?.trim()) {
      alert('La unidad de medida es obligatoria')
      return
    }

    const body = {
      codigo: form.value.codigo.trim(),
      nombre: form.value.nombre.trim(),
      precio: form.value.precio,
      unidad_medida: form.value.unidad_medida.trim(),
      idCategoria: form.value.idCategoria,
      nitCiProveedor: form.value.nitCiProveedor,
    }

    if (props.modoEdicion && props.producto) {
      await http.patch(`${ENDPOINT}/${props.producto.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    resetForm()
    dialogVisible.value = false
  } catch (error: any) {
    const mensaje =
      error?.response?.data?.message ||
      (Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(', ')
        : 'Error al guardar el producto')
    alert(mensaje)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Producto' : 'Nuevo Producto'"
      :style="{ width: '35rem' }"
      modal
    >
      <div class="flex flex-column gap-3">
        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="codigo" class="font-semibold">Código *</label>
            <InputText
              id="codigo"
              v-model="form.codigo"
              maxlength="10"
              autocomplete="off"
              autofocus
            />
          </div>
          <div class="flex flex-column gap-2 flex-2">
            <label for="nombre" class="font-semibold">Nombre *</label>
            <InputText
              id="nombre"
              v-model="form.nombre"
              maxlength="100"
              autocomplete="off"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="categoria" class="font-semibold">Categoría *</label>
            <Select
              id="categoria"
              v-model="form.idCategoria"
              :options="categorias"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione una categoría"
              class="w-full"
            />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="proveedor" class="font-semibold">Proveedor *</label>
            <Select
              id="proveedor"
              v-model="form.nitCiProveedor"
              :options="proveedores"
              optionLabel="nombreCompleto"
              optionValue="nitCi"
              placeholder="Seleccione un proveedor"
              class="w-full"
            >
              <template #option="slotProps">
                <span>
                  {{ slotProps.option.nombres }} {{ slotProps.option.apellidos }}
                  <small class="text-color-secondary">({{ slotProps.option.nitCi }})</small>
                </span>
              </template>
            </Select>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="precio" class="font-semibold">Precio (Bs.) *</label>
            <InputNumber
              id="precio"
              v-model="form.precio"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :min="0"
              locale="es-BO"
              class="w-full"
            />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="unidad" class="font-semibold">Unidad de Medida *</label>
            <Select
              id="unidad"
              v-model="form.unidad_medida"
              :options="unidadesMedida"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione una unidad"
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

<style scoped></style>
