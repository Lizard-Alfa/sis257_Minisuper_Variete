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
<<<<<<< HEAD
import { Usuario } from '../../usuarios/entities/usuario.entity';
=======
import { Trabajador } from '../../trabajadores/entities/trabajador.entity';
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
import { Cliente } from '../../clientes/entities/cliente.entity';
import { VentaDetalle } from './venta-detalle.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 15, unique: true })
  transaccion: string;

<<<<<<< HEAD
  @Column('integer', { name: 'id_usuario' })
  idUsuario: number;

  @Column('varchar', { length: 15, name: 'cliente_ci' })
  clienteCi: string;

  @Column('varchar', { length: 100, name: 'cliente_nombre' })
  clienteNombre: string;

  @Column('varchar', { length: 20, name: 'tipo_cliente', default: 'ocasional' })
  tipoCliente: string;

  @Column('varchar', { length: 15, name: 'metodo_pago' })
  metodoPago: string;

=======
  @Column('integer', { name: 'id_trabajador' })
  idTrabajador: number;

  @Column('integer', { name: 'id_cliente' })
  idCliente: number;

  @Column('varchar', { length: 15, name: 'metodo_pago' })
  metodoPago: string;

  @Column('varchar', { length: 50, nullable: true })
  observaciones: string | null;

>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
<<<<<<< HEAD
  iva: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'monto_pagado', default: 0 })
  montoPagado: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cambio: number;

  @Column('varchar', { length: 50, nullable: true })
  observaciones: string | null;

  @Column('varchar', { length: 10, default: 'activa' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'cliente_ci', referencedColumnName: 'clienteCi' })
=======
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
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
  cliente: Cliente;

  @OneToMany(() => VentaDetalle, (detalle) => detalle.venta)
  detalles: VentaDetalle[];
}