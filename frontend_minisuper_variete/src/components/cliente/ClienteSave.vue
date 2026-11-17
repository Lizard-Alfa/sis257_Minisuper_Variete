<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, InputText, Button } from 'primevue'
import http from '@/plugins/axios'
import type { Cliente } from '@/models/cliente'

const props = defineProps<{
  mostrar: boolean
  cliente: Cliente | null
  modoEdicion: boolean
}>()

const emit = defineEmits<{
  (e: 'guardar'): void
  (e: 'close'): void
}>()

const form = ref({ clienteCi: '', clienteNombre: '', telefono: '' })

watch(
  () => props.cliente,
  (nuevo) => {
    if (nuevo) {
      form.value = { ...nuevo }
    } else {
      form.value = { clienteCi: '', clienteNombre: '', telefono: '' }
    }
  },
)

async function guardar() {
  if (!form.value.clienteCi || !form.value.clienteNombre) {
    alert('CI y Nombre son obligatorios')
    return
  }
  try {
    if (props.modoEdicion) {
      await http.patch(`clientes/${form.value.clienteCi}`, form.value)
    } else {
      await http.post('clientes', form.value)
    }
    emit('guardar')
    emit('close')
  } catch {
    alert('Error al guardar')
  }
}
</script>

<template>
  <Dialog
    :visible="mostrar"
    :header="modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'"
    :style="{ width: '30rem' }"
    modal
    @hide="emit('close')"
  >
    <div class="flex flex-column gap-3">
      <div class="flex flex-column gap-2">
        <label for="ci" class="font-semibold">CI:</label>
        <InputText id="ci" v-model="form.clienteCi" :disabled="modoEdicion" />
      </div>
      <div class="flex flex-column gap-2">
        <label for="nombre" class="font-semibold">Nombre:</label>
        <InputText id="nombre" v-model="form.clienteNombre" />
      </div>
      <div class="flex flex-column gap-2">
        <label for="tel" class="font-semibold">Teléfono (opcional):</label>
        <InputText id="tel" v-model="form.telefono" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="emit('close')" />
      <Button label="Guardar" icon="pi pi-check" @click="guardar" />
    </template>
  </Dialog>
</template>
