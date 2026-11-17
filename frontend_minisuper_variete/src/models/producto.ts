import type { Categoria } from "./categoria"
import type { Proveedor } from "./proveedor"

export interface Producto {
  id: number
  codigo: string
  nombre: string
  categoria: Categoria
  proveedor: Proveedor
  precio: number
  unidad_medida: string
  imagenUrl: string
  estado: boolean
}
