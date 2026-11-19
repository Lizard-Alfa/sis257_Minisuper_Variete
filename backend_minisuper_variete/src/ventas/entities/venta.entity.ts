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
import { Cliente } from '../../clientes/entities/cliente.entity';
import { VentaDetalle } from './venta-detalle.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 15, unique: true })
  transaccion: string;

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

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
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
  cliente: Cliente;

  @OneToMany(() => VentaDetalle, (detalle) => detalle.venta)
  detalles: VentaDetalle[];
}