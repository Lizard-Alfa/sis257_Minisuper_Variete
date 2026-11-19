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
import { Trabajador } from '../../trabajadores/entities/trabajador.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { VentaDetalle } from './venta-detalle.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 15, unique: true })
  transaccion: string;

  @Column('integer', { name: 'id_trabajador' })
  idTrabajador: number;

  @Column('integer', { name: 'id_cliente' })
  idCliente: number;

  @Column('varchar', { length: 15, name: 'metodo_pago' })
  metodoPago: string;

  @Column('varchar', { length: 50, nullable: true })
  observaciones: string | null;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column('varchar', { length: 10, default: 'activa' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.ventas)
  @JoinColumn({ name: 'id_trabajador', referencedColumnName: 'id' })
  trabajador: Trabajador;

  @ManyToOne(() => Cliente, (cliente) => cliente.ventas)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  cliente: Cliente;

  @OneToMany(() => VentaDetalle, (detalle) => detalle.venta)
  detalles: VentaDetalle[];
}