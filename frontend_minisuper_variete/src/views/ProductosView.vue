<script setup lang="ts">
import ProductoList from '@/components/producto/ProductoList.vue'
import ProductoSave from '@/components/producto/ProductoSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Producto } from '@/models/producto'

const mostrarDialog = ref<boolean>(false)
const productoListRef = ref<InstanceType<typeof ProductoList> | null>(null)
const productoEdit = ref<Producto | null>(null)

function handleCreate() {
  productoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(producto: Producto) {
  productoEdit.value = producto
  mostrarDialog.value = true
}

function handleSave() {
  productoListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <section class="section" data-section="section-productos">
    <div class="container">
      <div class="row pt-4 mt-4">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2><i class="pi pi-box mr-2"></i> Productos</h2>
            <Button label="Nuevo Producto" icon="pi pi-plus" @click="handleCreate" />
          </div>

          <ProductoList ref="productoListRef" @edit="handleEdit" />

          <ProductoSave
            :mostrar="mostrarDialog"
            :producto="productoEdit"
            :modoEdicion="!!productoEdit"
            @guardar="handleSave"
            @close="handleCloseDialog"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
