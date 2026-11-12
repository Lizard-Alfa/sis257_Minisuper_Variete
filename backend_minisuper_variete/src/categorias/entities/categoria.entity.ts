import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Producto, producto => producto.categoria)
  productos: Producto[];
}
