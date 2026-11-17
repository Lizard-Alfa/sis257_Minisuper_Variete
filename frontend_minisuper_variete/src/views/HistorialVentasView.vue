<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import http from '@/plugins/axios'
import { useAuthStore } from '@/stores/index'

interface Detalle {
  id: number
  cantidad: number
  precioUnitario: string | number
  subtotal: string | number
  producto: { codigo: string; nombre: string }
}

interface Venta {
  id: number
  fechaVenta: string
  clienteNombre: string
  tipoCliente: string
  metodoPago: string
  subtotal: string | number
  iva: string | number
  total: string | number
  montoPagado: string | number
  cambio: string | number
  estado: string
  observaciones: string
  usuario: { id: number; usuario: string }
  detalles: Detalle[]
}

const ventas = ref<Venta[]>([])
const filtroEstado = ref('todas')
const expandedId = ref<number | null>(null)

onMounted(async () => {
  const res = await http.get('ventas')
  ventas.value = res.data
})

const ventasFiltradas = computed(() => {
  if (filtroEstado.value === 'todas') return ventas.value
  return ventas.value.filter(v => v.estado === filtroEstado.value)
})

function toggleDetalles(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString('es-BO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <div class="container mt-4" v-if="useAuthStore().isAdmin">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="pi pi-history"></i> Historial de Ventas</h2>
      <select v-model="filtroEstado" class="form-select w-auto">
        <option value="todas">Todas</option>
        <option value="completada">Completadas</option>
        <option value="anulada">Anuladas</option>
      </select>
    </div>

    <div class="card p-3">
      <div class="table-responsive">
        <table class="table table-sm table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Pago</th>
              <th>Total</th>
              <th>Cajero</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="v in ventasFiltradas" :key="v.id">
              <tr>
                <td>{{ v.id }}</td>
                <td>{{ formatearFecha(v.fechaVenta) }}</td>
                <td>{{ v.clienteNombre }}</td>
                <td>
                  <span class="badge" :class="v.tipoCliente === 'regular' ? 'bg-primary' : 'bg-secondary'">
                    {{ v.tipoCliente }}
                  </span>
                </td>
                <td>{{ v.metodoPago }}</td>
                <td class="fw-bold">Bs. {{ v.total }}</td>
                <td>{{ v.usuario?.usuario || '-' }}</td>
                <td>
                  <span class="badge" :class="v.estado === 'completada' ? 'bg-success' : 'bg-danger'">
                    {{ v.estado }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" @click="toggleDetalles(v.id)">
                    {{ expandedId === v.id ? 'Ocultar' : 'Detalles' }}
                  </button>
                </td>
              </tr>
              <tr v-if="expandedId === v.id">
                <td colspan="9" class="bg-light p-3">
                  <h6 class="mb-2">Productos vendidos:</h6>
                  <table class="table table-sm mb-0">
                    <thead>
                      <tr><th>Código</th><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="d in v.detalles" :key="d.id">
                        <td>{{ d.producto?.codigo }}</td>
                        <td>{{ d.producto?.nombre }}</td>
                        <td>{{ d.cantidad }}</td>
                        <td>Bs. {{ d.precioUnitario }}</td>
                        <td>Bs. {{ d.subtotal }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="mt-2 small text-muted">
                    <span>Subtotal: Bs. {{ v.subtotal }}</span> |
                    <span>IVA: Bs. {{ v.iva }}</span> |
                    <span>Pagado: Bs. {{ v.montoPagado }}</span> |
                    <span>Cambio: Bs. {{ v.cambio }}</span>
                  </div>
                  <div v-if="v.observaciones" class="mt-1 small">
                    <strong>Obs:</strong> {{ v.observaciones }}
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div v-if="ventasFiltradas.length === 0" class="text-center text-muted py-4">
        No hay ventas registradas.
      </div>
    </div>
  </div>
  <div v-else class="container mt-4 text-center">
    <h3>Acceso restringido. Solo administradores pueden ver el historial.</h3>
  </div>
</template>
