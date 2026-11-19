import type { Cliente } from './cliente'
import type { Producto } from './producto'

export interface VentaDetalle {
  id: number
  idVenta: number
  idProducto: number
  cantidad: number
  descuentoMonto: string
  precioUnitario: string
  subtotal: string
  producto: Producto
}

export interface Venta {
  id: number
  transaccion: string
  idUsuario: number
  idCliente: number
  metodoPago: string
  observaciones: string | null
  subtotal: string
  total: string
  estado: 'activa' | 'anulada'
  fechaCreacion: string
  usuario: { id: number; usuario: string }
  cliente: Cliente
  detalles?: VentaDetalle[]
}
