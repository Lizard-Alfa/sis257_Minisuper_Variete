<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { AutoComplete, Button, InputNumber, InputText, Select } from 'primevue'
import type { Producto } from '@/models/producto'
import type { Categoria } from '@/models/categoria'
import type { Cliente } from '@/models/cliente'
import ClienteSave from '../cliente/ClienteSave.vue'

interface ItemCarrito {
  producto: Producto
  cantidad: number
}

const productos = ref<Producto[]>([])
const categorias = ref<Categoria[]>([])
const clientes = ref<Cliente[]>([])

const busqueda = ref<string>('')
const categoriaSeleccionada = ref<number | null>(null)
const carrito = ref<ItemCarrito[]>([])

// string mientras escribe, Cliente cuando elige, null si está vacío
const cliente = ref<Cliente | string | null>(null)
const sugerencias = ref<Cliente[]>([])
const mostrarNuevoCliente = ref<boolean>(false)
const clienteNuevo = ref<Cliente | null>(null)

const clienteId = computed(() =>
  typeof cliente.value === 'object' ? cliente.value?.id : undefined,
)
const textoEscrito = computed(() => (typeof cliente.value === 'string' ? cliente.value.trim() : ''))

function buscarCliente(event: { query: string }) {
  const q = event.query.trim().toLowerCase()

  sugerencias.value = q
    ? clientes.value
        .filter((c) =>
          [c.nitCi, c.nombres, c.apllidos].some((valor) =>
            String(valor ?? '')
              .toLowerCase()
              .includes(q),
          ),
        )
        .slice(0, 8)
    : []
}

function abrirNuevoCliente() {
  const texto = textoEscrito.value

  clienteNuevo.value = {
    id: 0,
    nitCi: /^\d+$/.test(texto) ? texto : '',
    nombres: /^\d+$/.test(texto) ? '' : texto,
    apllidos: '',
    telefono: '',
  } as Cliente

  mostrarNuevoCliente.value = true
}

function clienteGuardado(nuevo: Cliente) {
  if (!nuevo?.id) {
    mostrarAviso('No se pudo recuperar el cliente registrado')
    return
  }

  const indice = clientes.value.findIndex((c) => c.id === nuevo.id)

  if (indice >= 0) {
    clientes.value[indice] = nuevo
  } else {
    clientes.value.push(nuevo)
  }

  cliente.value = nuevo
  sugerencias.value = []
  mostrarNuevoCliente.value = false

  mostrarAviso('Cliente registrado y seleccionado correctamente')
}
const metodoPago = ref<string>('efectivo')
const observaciones = ref<string>('')
const recibido = ref<number | null>(null)

const aviso = ref<string>('')
const guardando = ref<boolean>(false)

const metodosPago = [
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Tarjeta', value: 'tarjeta' },
  { label: 'QR', value: 'qr' },
]

async function cargarDatos() {
  const [prod, cat, cli] = await Promise.all([
    http.get('productos'),
    http.get('categorias'),
    http.get('clientes'),
  ])
  productos.value = prod.data
  categorias.value = cat.data
  clientes.value = cli.data
}

/* ---------- Precios (solo para mostrar; el backend recalcula todo) ---------- */

function descuentoVigente(p: Producto): boolean {
  const hoy = new Date().toLocaleDateString('en-CA') // AAAA-MM-DD
  const normal = Number(p.precio)
  const desc = Number(p.precioDescuento)
  const inicio = p.descuentoInicio ? String(p.descuentoInicio).slice(0, 10) : null
  const fin = p.descuentoFin ? String(p.descuentoFin).slice(0, 10) : null
  return desc > 0 && desc < normal && !!inicio && !!fin && inicio <= hoy && hoy <= fin
}

function precioAplicable(p: Producto): number {
  return descuentoVigente(p) ? Number(p.precioDescuento) : Number(p.precio)
}

/* ---------- Filtro de productos ---------- */

const productosFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase()
  return productos.value.filter((p) => {
    const coincideCategoria =
      categoriaSeleccionada.value === null || p.idCategoria === categoriaSeleccionada.value
    const coincideTexto =
      !texto || p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto)
    return coincideCategoria && coincideTexto
  })
})

/* ---------- Carrito ---------- */

function mostrarAviso(texto: string) {
  aviso.value = texto
  setTimeout(() => (aviso.value = ''), 3000)
}

function agregar(producto: Producto) {
  if (producto.stock <= 0) return
  const item = carrito.value.find((i) => i.producto.id === producto.id)
  if (item) {
    if (item.cantidad >= producto.stock) {
      mostrarAviso(`Solo hay ${producto.stock} de ${producto.nombre}`)
      return
    }
    item.cantidad++
  } else {
    carrito.value.push({ producto, cantidad: 1 })
  }
}

function quitar(idProducto: number) {
  carrito.value = carrito.value.filter((i) => i.producto.id !== idProducto)
}

function subtotalItem(item: ItemCarrito): number {
  return precioAplicable(item.producto) * item.cantidad
}

const total = computed(() => carrito.value.reduce((suma, i) => suma + subtotalItem(i), 0))

const ahorro = computed(() =>
  carrito.value.reduce((suma, i) => {
    if (!descuentoVigente(i.producto)) return suma
    return suma + (Number(i.producto.precio) - Number(i.producto.precioDescuento)) * i.cantidad
  }, 0),
)

const cambio = computed(() => (recibido.value ?? 0) - total.value)

/* ---------- Cobrar ---------- */

async function cobrar() {
  if (carrito.value.length === 0) return
  guardando.value = true
  try {
    const body = {
      idCliente: clienteId.value,
      metodoPago: metodoPago.value,
      observaciones: observaciones.value.trim() || undefined,
      detalles: carrito.value.map((i) => ({
        idProducto: i.producto.id,
        cantidad: i.cantidad,
      })),
    }
    const respuesta = await http.post('ventas', body)
    mostrarAviso(`Venta ${respuesta.data.transaccion} registrada`)

    carrito.value = []
    cliente.value = null
    metodoPago.value = 'efectivo'
    observaciones.value = ''
    recibido.value = null
    await cargarDatos() // refresca el stock
  } catch (error: any) {
    const mensaje = error?.response?.data?.message
    alert(Array.isArray(mensaje) ? mensaje.join('\n') : mensaje || 'Error al registrar la venta')
    await cargarDatos() // por si el stock cambió
  } finally {
    guardando.value = false
  }
}

onMounted(cargarDatos)
</script>

<template>
  <div class="venta-layout">
    <!-- IZQUIERDA: productos -->
    <div class="venta-productos">
      <InputText v-model="busqueda" placeholder="Buscar por nombre o código" class="w-full mb-3" />

      <div class="flex flex-wrap gap-2 mb-3">
        <Button
          label="Todas"
          size="small"
          :outlined="categoriaSeleccionada !== null"
          @click="categoriaSeleccionada = null"
        />
        <Button
          v-for="c in categorias"
          :key="c.id"
          :label="c.nombre"
          size="small"
          :outlined="categoriaSeleccionada !== c.id"
          @click="categoriaSeleccionada = c.id"
        />
      </div>

      <div class="grilla">
        <div
          v-for="p in productosFiltrados"
          :key="p.id"
          class="tarjeta"
          :class="{ agotado: p.stock <= 0 }"
          @click="agregar(p)"
        >
          <div class="tarjeta-img">
            <img v-if="p.imagen" :src="p.imagen" :alt="p.nombre" />
            <i v-else class="pi pi-image"></i>
            <span v-if="p.stock <= 0" class="etiqueta-agotado">Agotado</span>
          </div>
          <div class="tarjeta-nombre">{{ p.nombre }}</div>
          <div class="tarjeta-precio">
            <span v-if="descuentoVigente(p)" class="precio-tachado">
              Bs {{ Number(p.precio).toFixed(2) }}
            </span>
            <strong>Bs {{ precioAplicable(p).toFixed(2) }}</strong>
          </div>
        </div>
        <p v-if="productosFiltrados.length === 0">No se encontraron productos</p>
      </div>
    </div>

    <!-- DERECHA: carrito y cobro -->
    <div class="venta-carrito">
      <h3 class="mt-0"><i class="pi pi-shopping-cart mr-2"></i> Venta</h3>

      <p v-if="aviso" class="aviso">{{ aviso }}</p>

      <div class="carrito-lista">
        <p v-if="carrito.length === 0" class="vacio">Toca un producto para agregarlo</p>
        <div v-for="item in carrito" :key="item.producto.id" class="carrito-item">
          <div class="flex justify-content-between align-items-center">
            <span class="item-nombre">{{ item.producto.nombre }}</span>
            <Button
              icon="pi pi-times"
              text
              severity="danger"
              size="small"
              aria-label="Quitar"
              @click="quitar(item.producto.id)"
            />
          </div>
          <div class="flex justify-content-between align-items-center">
            <InputNumber
              v-model="item.cantidad"
              showButtons
              buttonLayout="horizontal"
              :min="1"
              :max="item.producto.stock"
              :allowEmpty="false"
              :inputStyle="{ width: '3.5rem', textAlign: 'center' }"
              size="small"
            />
            <strong>Bs {{ subtotalItem(item).toFixed(2) }}</strong>
          </div>
        </div>
      </div>

      <div class="totales">
        <div v-if="ahorro > 0" class="flex justify-content-between">
          <span>Ahorro por descuentos</span>
          <span>Bs {{ ahorro.toFixed(2) }}</span>
        </div>
        <div class="flex justify-content-between total">
          <span>TOTAL</span>
          <span>Bs {{ total.toFixed(2) }}</span>
        </div>
      </div>

      <div class="flex flex-column gap-2 mt-3">
        <div class="flex gap-2">
          <AutoComplete
            v-model="cliente"
            :suggestions="sugerencias"
            optionLabel="nombres"
            placeholder="Cliente general (buscar por CI o nombre)"
            class="flex-auto"
            :minLength="1"
            appendTo="self"
            @complete="buscarCliente"
          >
            <template #option="{ option }">
              <div>
                <strong>{{ option.nitCi }}</strong> · {{ option.nombres }} {{ option.apllidos }}
              </div>
            </template>
            <template #empty>No se encontró. Usa «Nuevo» para registrarlo.</template>
          </AutoComplete>
          <Button
            icon="pi pi-user-plus"
            label="Nuevo"
            severity="secondary"
            @click="abrirNuevoCliente"
          />
        </div>
        <Select
          v-model="metodoPago"
          :options="metodosPago"
          optionLabel="label"
          optionValue="value"
          appendTo="self"
        />

        <template v-if="metodoPago === 'efectivo'">
          <InputNumber
            v-model="recibido"
            placeholder="Monto recibido"
            mode="decimal"
            :minFractionDigits="2"
            :min="0"
          />
          <div v-if="recibido !== null" class="cambio" :class="{ falta: cambio < 0 }">
            {{ cambio >= 0 ? 'Cambio' : 'Falta' }}: Bs {{ Math.abs(cambio).toFixed(2) }}
          </div>
        </template>

        <InputText v-model="observaciones" placeholder="Observaciones (opcional)" maxlength="50" />

        <Button
          label="Cobrar"
          icon="pi pi-check"
          size="large"
          :disabled="carrito.length === 0"
          :loading="guardando"
          @click="cobrar"
        />
      </div>
    </div>
  </div>
  <ClienteSave
    :mostrar="mostrarNuevoCliente"
    :cliente="clienteNuevo"
    :modoEdicion="false"
    @guardar="clienteGuardado"
    @close="mostrarNuevoCliente = false"
  />
</template>

<style scoped>
.venta-layout {
  display: grid;
  grid-template-columns: 1fr 24rem;
  gap: 1rem;
  align-items: start;
}
.grilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 0.75rem;
}
.tarjeta {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  text-align: center;
  background: #fff;
}
.tarjeta:hover {
  border-color: var(--p-primary-color);
}
.tarjeta.agotado {
  opacity: 0.45;
  cursor: not-allowed;
}
.tarjeta-img {
  position: relative;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tarjeta-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.tarjeta-img i {
  font-size: 2rem;
  color: #aaa;
}
.etiqueta-agotado {
  position: absolute;
  background: #c0392b;
  color: #fff;
  padding: 0.1rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}
.tarjeta-nombre {
  font-size: 0.85rem;
  margin: 0.4rem 0 0.2rem;
  min-height: 2.2rem;
}
.precio-tachado {
  text-decoration: line-through;
  color: #888;
  font-size: 0.75rem;
  margin-right: 0.3rem;
}
.venta-carrito {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #fff;
  position: sticky;
  top: 1rem;
}
.carrito-lista {
  max-height: 18rem;
  overflow-y: auto;
}
.carrito-item {
  border-bottom: 1px solid #eee;
  padding: 0.4rem 0;
}
.item-nombre {
  font-size: 0.9rem;
}
.vacio {
  color: #888;
  text-align: center;
}
.totales {
  border-top: 2px solid #ddd;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}
.total {
  font-size: 1.6rem;
  font-weight: bold;
}
.cambio {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2e7d32;
}
.cambio.falta {
  color: #c0392b;
}
.aviso {
  background: #fff3cd;
  padding: 0.4rem 0.6rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
}
@media (max-width: 900px) {
  .venta-layout {
    grid-template-columns: 1fr;
  }
}
</style>
