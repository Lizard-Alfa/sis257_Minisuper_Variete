<script setup lang="ts">
import ProveedorList from '@/components/proveedor/ProveedorList.vue'
import ProveedorSave from '@/components/proveedor/ProveedorSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Proveedor } from '@/models/proveedor'

const mostrarDialog = ref<boolean>(false)
const proveedorListRef = ref<InstanceType<typeof ProveedorList> | null>(null)
const proveedorEdit = ref<Proveedor | null>(null)

function handleCreate() {
  proveedorEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(proveedor: Proveedor) {
  proveedorEdit.value = proveedor
  mostrarDialog.value = true
}

function handleSave() {
  proveedorListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <section class="section" data-section="section-proveedores">
    <div class="container">
      <div class="row pt-4 mt-4">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2><i class="pi pi-truck mr-2"></i> Proveedores</h2>
            <Button label="Nuevo Proveedor" icon="pi pi-plus" @click="handleCreate" />
          </div>

          <ProveedorList ref="proveedorListRef" @edit="handleEdit" />

          <ProveedorSave
            :mostrar="mostrarDialog"
            :proveedor="proveedorEdit"
            :modoEdicion="!!proveedorEdit"
            @guardar="handleSave"
            @close="handleCloseDialog"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
