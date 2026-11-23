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
  (e: 'guardar', cliente: Cliente): void
  (e: 'close'): void
}>()

// Inicializamos con los campos exactos de tu entidad (nitCi, nombres, apllidos, telefono)
const form = ref({
  id: 0,
  nitCi: '',
  nombres: '',
  apllidos: '',
  telefono: '',
})

watch(
  [() => props.cliente, () => props.mostrar],
  ([nuevo, mostrar]) => {
    if (!mostrar) return

    form.value = {
      id: nuevo?.id ?? 0,
      nitCi: nuevo?.nitCi ?? '',
      nombres: nuevo?.nombres ?? '',
      apllidos: nuevo?.apllidos ?? '',
      telefono: nuevo?.telefono ?? '',
    }
  },
  { immediate: true },
)

async function guardar() {
  if (!form.value.nitCi || !form.value.nombres) {
    alert('CI y Nombre son obligatorios')
    return
  }

  try {
    const { id, ...body } = form.value
    const { data } = props.modoEdicion
      ? await http.patch(`clientes/${id}`, body)
      : await http.post('clientes', body)

    emit('guardar', data)
    emit('close')
  } catch (error: any) {
    alert(error?.response?.data?.message || 'Error al guardar')
  }
}
</script>

<template>
  <Dialog
    :visible="mostrar"
    :header="modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'"
    :style="{ width: '30rem' }"
    modal
    :closable="true"
    @update:visible="
      (valor) => {
        if (!valor) emit('close')
      }
    "
    @hide="emit('close')"
  >
    
    <div class="flex flex-column gap-3">
      <div class="flex flex-column gap-2">
        <label for="ci" class="font-semibold">CI / NIT:</label>
        <InputText id="ci" v-model="form.nitCi" autocomplete="off" type = "number" />
      </div>

      <div class="flex flex-column gap-2">
        <label for="nombres" class="font-semibold">Nombres:</label>
        <InputText id="nombres" v-model="form.nombres" autocomplete="off" />
      </div>

      <div class="flex flex-column gap-2">
        <label for="apllidos" class="font-semibold">Apellidos:</label>
        <InputText id="apllidos" v-model="form.apllidos" autocomplete="off" />
      </div>

      <div class="flex flex-column gap-2">
        <label for="tel" class="font-semibold">Teléfono (opcional):</label>
        <InputText id="tel" v-model="form.telefono" autocomplete="off" />
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="emit('close')" />
      <Button label="Guardar" icon="pi pi-check" @click="guardar" />
    </template>
  </Dialog>
</template>

<style scoped></style>
