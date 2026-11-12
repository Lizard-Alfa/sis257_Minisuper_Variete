import type { Categoria } from './categoria'

export interface Proveedor {
  id: number
  nitCi: string
  nombres: string
  apellidos: string
  telefono?: string
  direccion?: string
  email?: string
}

export interface Producto {
  id: number
  codigo: string
  nombre: string
  precio: number
  unidad_medida: string
  estado: boolean
  categoria?: Categoria
  proveedor?: Proveedor
}
