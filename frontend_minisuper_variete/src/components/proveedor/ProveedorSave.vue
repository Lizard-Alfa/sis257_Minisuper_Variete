<script setup lang="ts">
import type { Proveedor } from '@/models/proveedor'
import { computed, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { Button, Dialog, InputText } from 'primevue'

const ENDPOINT = 'proveedores'

const props = defineProps({
  mostrar: Boolean,
  proveedor: {
    type: Object as () => Proveedor | null,
    default: () => null,
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close'])

const form = ref({
  nitCi: '',
  nombres: '',
  apellidos: '',
  telefono: '',
  direccion: '',
  email: '',
})

watch(
  () => props.mostrar,
  (visible) => {
    if (visible) {
      if (props.modoEdicion && props.proveedor) {
        form.value = {
          nitCi: props.proveedor.nitCi ?? '',
          nombres: props.proveedor.nombres ?? '',
          apellidos: props.proveedor.apellidos ?? '',
          telefono: props.proveedor.telefono ?? '',
          direccion: props.proveedor.direccion ?? '',
          email: props.proveedor.email ?? '',
        }
      } else {
        resetForm()
      }
    }
  },
)

function resetForm() {
  form.value = {
    nitCi: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    email: '',
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
    if (!form.value.nitCi?.trim()) {
      alert('El NIT/CI es obligatorio')
      return
    }
    if (!form.value.nombres?.trim()) {
      alert('Los nombres son obligatorios')
      return
    }
    if (!form.value.apellidos?.trim()) {
      alert('Los apellidos son obligatorios')
      return
    }
    if (!form.value.telefono?.trim()) {
      alert('El teléfono es obligatorio')
      return
    }
    if (!form.value.direccion?.trim()) {
      alert('La dirección es obligatoria')
      return
    }
    if (!form.value.email?.trim()) {
      alert('El email es obligatorio')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email)) {
      alert('El email no tiene un formato válido')
      return
    }

    const body = {
      nitCi: form.value.nitCi.trim(),
      nombres: form.value.nombres.trim(),
      apellidos: form.value.apellidos.trim(),
      telefono: form.value.telefono.trim(),
      direccion: form.value.direccion.trim(),
      email: form.value.email.trim().toLowerCase(),
    }

    if (props.modoEdicion && props.proveedor) {
      await http.patch(`${ENDPOINT}/${props.proveedor.id}`, body)
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
        : 'Error al guardar el proveedor')
    alert(mensaje)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Proveedor' : 'Nuevo Proveedor'"
      :style="{ width: '35rem' }"
      modal
    >
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label for="nitCi" class="font-semibold">NIT / CI *</label>
          <InputText
            id="nitCi"
            v-model="form.nitCi"
            maxlength="20"
            autocomplete="off"
            autofocus
          />
        </div>

        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="nombres" class="font-semibold">Nombres *</label>
            <InputText
              id="nombres"
              v-model="form.nombres"
              maxlength="50"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="apellidos" class="font-semibold">Apellidos *</label>
            <InputText
              id="apellidos"
              v-model="form.apellidos"
              maxlength="50"
              autocomplete="off"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <div class="flex flex-column gap-2 flex-1">
            <label for="telefono" class="font-semibold">Teléfono *</label>
            <InputText
              id="telefono"
              v-model="form.telefono"
              maxlength="20"
              autocomplete="off"
            />
          </div>
          <div class="flex flex-column gap-2 flex-1">
            <label for="email" class="font-semibold">Email *</label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              maxlength="30"
              autocomplete="off"
            />
          </div>
        </div>

        <div class="flex flex-column gap-2">
          <label for="direccion" class="font-semibold">Dirección *</label>
          <InputText
            id="direccion"
            v-model="form.direccion"
            maxlength="50"
            autocomplete="off"
          />
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
