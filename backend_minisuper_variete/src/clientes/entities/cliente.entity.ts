import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 15, name: 'cliente_ci', unique: true })
  clienteCi: string;

  @Column('varchar', { length: 100, name: 'cliente_nombre' })
  clienteNombre: string;

  @Column('varchar', { length: 15, nullable: true })
  telefono: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];
}