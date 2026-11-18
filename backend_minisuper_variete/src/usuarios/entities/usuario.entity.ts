import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { Trabajador } from '../../trabajadores/entities/trabajador.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_trabajador' })
  idTrabajador: number;

  @Column('varchar', { length: 12 })
  usuario: string;

  @Column('varchar', { length: 250 })
  clave: string;

  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar', { length: 15 })
  rol: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @BeforeInsert()
  @BeforeInsert()
  async hashPasswordOnInsert() {
    if (this.clave) {
      const salt = await genSalt();
      this.clave = await hash(this.clave, salt);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.clave);
  }
  @OneToOne(() => Trabajador, trabajadores => trabajadores.usuarios)
  @JoinColumn({ name: 'id_trabajador', referencedColumnName: 'id' })
  trabajador: Trabajador;
}
