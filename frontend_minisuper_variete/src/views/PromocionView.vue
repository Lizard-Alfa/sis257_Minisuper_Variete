<script setup lang="ts">
import PromocionList from '@/components/promocion/PromocionList.vue'
import PromocionSave from '@/components/promocion/PromocionSave.vue'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref<boolean>(false)
const promocionListRef = ref<typeof PromocionList | null>(null)

function handleCreate() {
  mostrarDialog.value = true
}

function handleSave() {
  promocionListRef.value?.obtenerLista()
}

function handleCloseDialog() {
  mostrarDialog.value = false
}
</script>

<template>
  <section class="section" data-section="section7">
    <div class="container">
      <div class="row pt-4 mt-4">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2><i class="pi pi-percentage mr-2"></i> Promociones</h2>
            <Button label="Nueva Promoción" icon="pi pi-plus" @click="handleCreate" />
          </div>

          <PromocionList ref="promocionListRef" />

          <PromocionSave :mostrar="mostrarDialog" @guardar="handleSave" @close="handleCloseDialog" />
        </div>
      </div>
    </div>
  </section>
</template>