import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { VentaDetalle } from '../../ventas/entities/venta-detalle.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 10 })
  codigo: string;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('integer', { name: 'id_categoria' })
  idCategoria: number;

  @Column('integer', { name: 'id_proveedor' })
  idProveedor: number;

  @Column('varchar', { length: 500 })
  imagen: string;

  @Column('varchar', { length: 50, name: 'unidad_medida' })
  unidadMedida: string;

  @Column()
  stock: number;

  @Column('integer', { name: 'stock_minimo' })
  stockMinimo: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'precio_descuento' })
  precioDescuento: number;

  @Column('date', { name: 'descuento_inicio', nullable: true })
  descuentoInicio: Date | null;

  @Column('date', { name: 'descuento_fin', nullable: true })
  descuentoFin: Date | null;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Categoria, categoria => categoria.productos)
  @JoinColumn({ name: 'id_categoria', referencedColumnName: 'id' })
  categoria: Categoria;

  @ManyToOne(() => Proveedor, proveedor => proveedor.productos)
  @JoinColumn({ name: 'id_proveedor', referencedColumnName: 'id' })
  proveedor: Proveedor;
  @OneToMany(() => VentaDetalle, detalle => detalle.producto)
  ventaDetalles: VentaDetalle[];
}
