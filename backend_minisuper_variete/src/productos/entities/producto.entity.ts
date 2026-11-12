import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 10, unique: true })
  codigo: string;

  @Column('varchar', { length: 100 })
  nombre: string;

  @ManyToOne(() => Categoria, categoria => categoria.productos)
  @JoinColumn({ name: 'id_categoria', referencedColumnName: 'id' })
  categoria: Categoria;

  @ManyToOne(() => Proveedor, proveedor => proveedor.productos)
  @JoinColumn({ name: 'nit_ci_proveedor', referencedColumnName: 'nitCi' })
  proveedor: Proveedor;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column('varchar', { length: 20 })
  unidad_medida: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

}
