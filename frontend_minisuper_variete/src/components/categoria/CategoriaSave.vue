<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputText } from 'primevue'

const ENDPOINT = 'categorias'

const props = defineProps({
  mostrar: Boolean,
  categoria: {
    type: Object as () => Categoria,
    default: () => ({ id: 0, nombre: '' }) as Categoria,
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close'])

const categoria = ref<Categoria>({ ...props.categoria })

watch(
  () => props.categoria,
  (newVal) => {
    categoria.value = { ...newVal }
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
    if (!categoria.value.nombre?.trim()) {
      alert('El nombre es obligatorio')
      return
    }

    const body = {
      nombre: categoria.value.nombre,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${categoria.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    categoria.value = { id: 0, nombre: '' }
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar')
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar' : 'Crear'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText
          id="nombre"
          v-model="categoria.nombre"
          class="flex-auto"
          autocomplete="off"
          autofocus
        />
      </div>
      <div class="flex justify-end gap-2">
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
