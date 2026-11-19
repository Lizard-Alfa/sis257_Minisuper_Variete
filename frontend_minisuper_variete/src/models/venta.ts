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
  idTrabajador: number
  idCliente: number
  metodoPago: string
  observaciones: string | null
  subtotal: string
  total: string
  estado: 'activa' | 'anulada'
  fechaCreacion: string
  trabajador: { id: number; nombres: string; apellidos: string }
  cliente: Cliente
  detalles?: VentaDetalle[]
}