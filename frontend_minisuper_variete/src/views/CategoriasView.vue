<script setup lang="ts">
import CategoriaList from '@/components/categoria/CategoriaList.vue'
import CategoriaSave from '@/components/categoria/CategoriaSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'
import type { Categoria } from '@/models/categoria'

const mostrarDialog = ref<boolean>(false)
const categoriaListRef = ref<typeof CategoriaList | null>(null)
const categoriaEdit = ref<Categoria | null>(null)

function handleCreate() {
  categoriaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(categoria: Categoria) {
  categoriaEdit.value = categoria
  mostrarDialog.value = true
}

function handleSave() {
  categoriaListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <section class="section" data-section="section6">
    <div class="container">
      <div class="row pt-6 mt-6">
        <div class="col-md-12">
          <h2>Categorías</h2>
          <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
          <CategoriaList ref="categoriaListRef" @edit="handleEdit" />
          <CategoriaSave
            :mostrar="mostrarDialog"
            :categoria="categoriaEdit"
            :modoEdicion="!!categoriaEdit"
            @guardar="handleSave"
            @close="handleCloseDialog"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
