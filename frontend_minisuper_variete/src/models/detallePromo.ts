import type { Producto } from './producto'
import type { Promocion } from './promocion'
export interface DetallePromo {
  id: number
  idPromocion: number
  idProducto: number
  precioOriginal: number
  precioDescuento: number
  producto: Producto
  promocion: Promocion
}
