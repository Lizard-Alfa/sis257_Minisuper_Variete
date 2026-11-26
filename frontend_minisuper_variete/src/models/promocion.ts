import type { Usuario } from "./usuario"

export interface Promocion {
  id: number
  nombre: string
  idUsuario: number
  tipo: 'global' | 'seleccionados'
  descuento: number | string
  fechaInicio: string
  fechaFin: string
  estado: 'activo' | 'concluido' | 'cancelado'
  usuario: Usuario
}