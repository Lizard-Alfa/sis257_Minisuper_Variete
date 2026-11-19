<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import http from '@/plugins/axios'
import { useAuthStore } from '@/stores/index'
import { Dialog, InputText, Button } from 'primevue'

interface Producto {
  id: number
  codigo: string
  nombre: string
  precio: string | number
}
interface ItemCarrito {
  producto: Producto
  cantidad: number
}
interface Cliente {
  clienteCi: string
  clienteNombre: string
  telefono: string
}

const productos = ref<Producto[]>([])
const carrito = ref<ItemCarrito[]>([])
const loading = ref(false)
const clienteCi = ref('')
const clienteNombre = ref('Cliente Ocasional')
const metodoPago = ref<'efectivo' | 'tarjeta' | 'qr'>('efectivo')
const montoPagado = ref<number>(0)
const observaciones = ref('')
const mostrarModal = ref(false)
const nuevoCliente = ref({ clienteCi: '', clienteNombre: '', telefono: '' })
const sugerencias = ref<Cliente[]>([])

onMounted(async () => {
  const res = await http.get('productos')
  productos.value = res.data
})

const total = computed(() =>
  carrito.value.reduce((sum, item) => {
    const precio =
      typeof item.producto.precio === 'string'
        ? parseFloat(item.producto.precio)
        : item.producto.precio
    return sum + precio * item.cantidad
  }, 0),
)
const iva = computed(() => (total.value * 13) / 113)
const cambio = computed(() => montoPagado.value - total.value)

function buscarCliente() {
  const texto = clienteCi.value.trim()

  if (!texto || texto === '0' || texto === 'S/N') {
    clienteNombre.value = 'Cliente Ocasional'
    sugerencias.value = []
    return
  }

  if (texto.length >= 2) {
    http
      .get(`clientes/buscar?ci=${texto}`)
      .then((res) => {
        sugerencias.value = res.data
      })
      .catch(() => {
        sugerencias.value = []
      })
  } else {
    sugerencias.value = []
  }
}

function seleccionarCliente(cliente: Cliente) {
  clienteCi.value = cliente.clienteCi
  clienteNombre.value = cliente.clienteNombre
  sugerencias.value = []
}

function agregar(p: Producto) {
  const ex = carrito.value.find((i) => i.producto.id === p.id)
  ex ? ex.cantidad++ : carrito.value.push({ producto: p, cantidad: 1 })
}

function quitar(id: number) {
  carrito.value = carrito.value.filter((i) => i.producto.id !== id)
}

function abrirModalNuevoCliente() {
  nuevoCliente.value = {
    clienteCi: clienteCi.value || '',
    clienteNombre: '',
    telefono: '',
  }
  mostrarModal.value = true
}

async function guardarNuevoCliente() {
  if (!nuevoCliente.value.clienteNombre) return alert('El nombre es obligatorio')
  try {
    await http.post('clientes', nuevoCliente.value)
    clienteCi.value = nuevoCliente.value.clienteCi
    clienteNombre.value = nuevoCliente.value.clienteNombre
    mostrarModal.value = false
  } catch {
    alert('Error al crear cliente')
  }
}

async function finalizar() {
  if (carrito.value.length === 0) return alert('Carrito vacío')
  if (montoPagado.value < total.value) return alert('Monto pagado insuficiente')
  loading.value = true
  try {
    const detalles = carrito.value.map((i) => ({ idProducto: i.producto.id, cantidad: i.cantidad }))
    await http.post('ventas', {
      detalles,
      clienteCi: clienteCi.value || '0',
      metodoPago: metodoPago.value,
      montoPagado: montoPagado.value,
      observaciones: observaciones.value,
    })
    alert('Venta registrada')
    carrito.value = []
    montoPagado.value = 0
    observaciones.value = ''
    clienteCi.value = ''
    clienteNombre.value = 'Cliente Ocasional'
  } catch {
    alert('Error al registrar venta')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mt-4" v-if="useAuthStore().isAdmin">
    <h2 class="mb-4"><i class="pi pi-shopping-cart"></i> Punto de Venta</h2>
    <div class="row">
      <div class="col-md-7">
        <div class="card p-3">
          <h5>Productos</h5>
          <div class="table-responsive" style="max-height: 400px">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in productos" :key="p.id">
                  <td>{{ p.codigo }}</td>
                  <td>{{ p.nombre }}</td>
                  <td>Bs. {{ p.precio }}</td>
                  <td><button class="btn btn-sm btn-primary" @click="agregar(p)">+</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-md-5">
        <div class="card p-3 bg-light">
          <h5>Carrito</h5>
          <ul class="list-group mb-3">
            <li
              v-for="item in carrito"
              :key="item.producto.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{{ item.producto.nombre }}</strong
                ><br />
                <small>Cant: {{ item.cantidad }} x Bs. {{ item.producto.precio }}</small>
              </div>
              <button class="btn btn-sm btn-danger" @click="quitar(item.producto.id)">✕</button>
            </li>
          </ul>

          <div class="mb-3" style="position: relative">
            <label class="form-label">Cliente (NIT/CI):</label>
            <input
              v-model="clienteCi"
              @input="buscarCliente"
              class="form-control"
              placeholder="Escribe el CI (0 para ocasional)"
            />

            <ul
              v-if="sugerencias.length > 0"
              class="list-group mt-1"
              style="position: absolute; z-index: 100; width: 100%"
            >
              <li
                v-for="c in sugerencias"
                :key="c.clienteCi"
                class="list-group-item list-group-item-action"
                style="cursor: pointer"
                @click="seleccionarCliente(c)"
              >
                <strong>{{ c.clienteNombre }}</strong> <small>(CI: {{ c.clienteCi }})</small>
              </li>
            </ul>

            <p class="mt-2 mb-0">
              Nombre: <strong>{{ clienteNombre }}</strong>
            </p>
            <button class="btn btn-sm btn-outline-success mt-2" @click="abrirModalNuevoCliente">
              + Nuevo Cliente
            </button>
          </div>

          <div class="mb-3">
            <label class="form-label">Método de Pago:</label>
            <select v-model="metodoPago" class="form-select">
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="qr">QR</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Monto Pagado (Bs.):</label>
            <input v-model.number="montoPagado" type="number" class="form-control" step="0.01" />
          </div>
          <div class="mb-3">
            <label class="form-label">Observaciones:</label>
            <input v-model="observaciones" class="form-control" />
          </div>
          <hr />
          <div class="d-flex justify-content-between">
            <span>Subtotal:</span><span>Bs. {{ (total - iva).toFixed(2) }}</span>
          </div>
          <!-- <div class="d-flex justify-content-between"><span>IVA (13%):</span><span>Bs. {{ iva.toFixed(2) }}</span></div> -->
          <h4 class="text-end mt-2">Total: Bs. {{ total.toFixed(2) }}</h4>
          <h5 class="text-end text-success" v-if="montoPagado > 0">
            Cambio: Bs. {{ cambio.toFixed(2) }}
          </h5>
          <button class="btn btn-success w-100 mt-3" :disabled="loading" @click="finalizar">
            {{ loading ? 'Procesando...' : 'Finalizar Venta' }}
          </button>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="mostrarModal" header="Nuevo Cliente" :style="{ width: '25rem' }" modal>
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-2">
          <label for="nc-ci" class="font-semibold">CI:</label>
          <InputText id="nc-ci" v-model="nuevoCliente.clienteCi" placeholder="Ingrese CI o NIT" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="nc-nombre" class="font-semibold">Nombre:</label>
          <InputText id="nc-nombre" v-model="nuevoCliente.clienteNombre" autofocus />
        </div>
        <div class="flex flex-column gap-2">
          <label for="nc-tel" class="font-semibold">Teléfono (opcional):</label>
          <InputText id="nc-tel" v-model="nuevoCliente.telefono" />
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="mostrarModal = false"
        />
        <Button label="Guardar" icon="pi pi-check" @click="guardarNuevoCliente" />
      </template>
    </Dialog>
  </div>
  <div v-else class="container mt-4 text-center">
    <h3>Acceso restringido. Solo administradores pueden realizar ventas.</h3>
  </div>
</template>
