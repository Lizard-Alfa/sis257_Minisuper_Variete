import type { Categoria } from './categoria'
import type { Proveedor } from './proveedor'

export interface Producto {
  id: number
  codigo: string
  nombre: string
  idCategoria: number
  idProveedor: number
  imagen: string
  unidadMedida: string
  stock: number
  stockMinimo: number
  precio: number
  precioDescuento: number
  descuentoInicio: Date | null
  descuentoFin: Date | null
  proveedor: Proveedor
  categoria: Categoria
}
