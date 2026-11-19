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
<<<<<<< HEAD

  @Column('varchar', { length: 15, name: 'cliente_ci', unique: true })
  clienteCi: string;

  @Column('varchar', { length: 100, name: 'cliente_nombre' })
  clienteNombre: string;

  @Column('varchar', { length: 15, nullable: true })
=======

  @Column('varchar', { length: 15, name: 'nit_ci' })
  nitCi: string;

  @Column('varchar', { length: 50 })
  nombres: string;

  @Column('varchar', { length: 50 })
  apllidos: string;

  @Column('varchar', { length: 15 })
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
  telefono: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

<<<<<<< HEAD
  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];
}
=======
  @OneToMany(() => Venta, venta => venta.cliente)
  ventas: Venta[];
}
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
