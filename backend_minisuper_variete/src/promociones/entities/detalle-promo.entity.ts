import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Promocion } from './promocion.entity';

@Entity('detalle_promociones')
export class DetallePromo {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_promocion' })
  idPromocion: number;

  @Column('integer', { name: 'id_producto' })
  idProducto: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'precio_original' })
  precioOriginal: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'precio_descuento' })
  precioDescuento: number;

  @ManyToOne(() => Promocion, promocion => promocion.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_promocion', referencedColumnName: 'id' })
  promocion: Promocion;

  @ManyToOne(() => Producto, producto => producto.promodetalles)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;
}
