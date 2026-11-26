import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('venta_detalles')
export class VentaDetalle {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_venta' })
  idVenta: number;

  @Column('integer', { name: 'id_producto' })
  idProducto: number;

  @Column('integer')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'descuento_monto', default: 0 })
  descuentoMonto: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Venta, venta => venta.detalles)
  @JoinColumn({ name: 'id_venta', referencedColumnName: 'id' })
  venta: Venta;

  @ManyToOne(() => Producto, producto => producto.ventaDetalles)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;
}
