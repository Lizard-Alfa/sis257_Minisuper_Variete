import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetallePromo } from './detalle-promo.entity';

@Entity('promociones')
export class Promocion {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('integer', { name: 'id_usuario' })
  idUsuario: number;

  @Column('varchar', { length: 15 })
  tipo: string; // 'global' | 'seleccionados'

  @Column('decimal', { precision: 5, scale: 2 })
  descuento: number; // porcentaje

  @Column('date', { name: 'fecha_inicio' })
  fechaInicio: string;

  @Column('date', { name: 'fecha_fin' })
  fechaFin: string;

  @Column('varchar', { length: 15, default: 'activo' })
  estado: string; // 'activo' | 'concluido' | 'cancelado'

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @ManyToOne(() => Usuario, usuario =>usuario.promociones)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

  @OneToMany(() => DetallePromo, detalle => detalle.promocion)
  detalles: DetallePromo[];
}
