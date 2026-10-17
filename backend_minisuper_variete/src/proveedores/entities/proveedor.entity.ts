import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 20, name: 'nit_ci' })
  nitCi: string;

  @Column('varchar', { length: 50 })
  nombres: string;

  @Column('varchar', { length: 50 })
  apellidos: string;

  @Column('varchar', { length: 20 })
  telefono: string;

  @Column('varchar', { length: 50 })
  direccion: string;

  @Column('varchar', { length: 30 })
  email: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;
}
