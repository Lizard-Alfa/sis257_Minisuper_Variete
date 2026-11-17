<script setup lang="ts">
import ClienteList from '@/components/cliente/ClienteList.vue'
import ClienteSave from '@/components/cliente/ClienteSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Cliente } from '@/models/cliente'

const mostrarDialog = ref<boolean>(false)
const clienteListRef = ref<InstanceType<typeof ClienteList> | null>(null)
const clienteEdit = ref<Cliente | null>(null)

function handleCreate() {
  clienteEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(cliente: Cliente) {
  clienteEdit.value = cliente
  mostrarDialog.value = true
}

function handleSave() {
  clienteListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <section class="section" data-section="section-clientes">
    <div class="container">
      <div class="row pt-4 mt-4">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2><i class="pi pi-users mr-2"></i> Clientes</h2>
            <Button label="Nuevo Cliente" icon="pi pi-plus" @click="handleCreate" />
          </div>
          <ClienteList ref="clienteListRef" @edit="handleEdit" />
          <ClienteSave
            :mostrar="mostrarDialog"
            :cliente="clienteEdit"
            :modoEdicion="!!clienteEdit"
            @guardar="handleSave"
            @close="handleCloseDialog"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
