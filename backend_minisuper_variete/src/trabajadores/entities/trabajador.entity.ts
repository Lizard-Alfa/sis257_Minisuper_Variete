import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('trabajadores')
export class Trabajador {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 15 })
  ci: string;

  @Column('varchar', { length: 50 })
  nombres: string;

  @Column('varchar', { length: 50 })
  apellidos: string;

  @Column('varchar', { length: 20 })
  telefono: string;

  @Column('varchar', { length: 100 })
  direccion: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToOne(() => Usuario, usuarios => usuarios.trabajador)
  usuarios: Usuario;
}
