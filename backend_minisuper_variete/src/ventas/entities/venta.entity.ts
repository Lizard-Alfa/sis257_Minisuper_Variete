import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VentaDetalle } from './venta-detalle.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum TipoCliente {
  OCASIONAL = 'ocasional',
  REGULAR = 'regular',
}

export enum MetodoPago {
  EFECTIVO = 'efectivo',
  TARJETA = 'tarjeta',
  QR = 'qr',
}

export enum EstadoVenta {
  COMPLETADA = 'completada',
  ANULADA = 'anulada',
}

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @CreateDateColumn({ name: 'fecha_venta' })
  fechaVenta: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_ci' })
  cliente: Cliente;

  @Column({ name: 'cliente_nombre', type: 'varchar', length: 100 })
  clienteNombre: string;

  @Column({ name: 'tipo_cliente', type: 'enum', enum: TipoCliente })
  tipoCliente: TipoCliente;

  @Column({ name: 'metodo_pago', type: 'enum', enum: MetodoPago })
  metodoPago: MetodoPago;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  iva: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'monto_pagado', type: 'decimal', precision: 10, scale: 2 })
  montoPagado: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cambio: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'enum', enum: EstadoVenta, default: EstadoVenta.COMPLETADA })
  estado: EstadoVenta;

  @OneToMany(() => VentaDetalle, (detalle) => detalle.venta, { cascade: true })
  detalles: VentaDetalle[];
}