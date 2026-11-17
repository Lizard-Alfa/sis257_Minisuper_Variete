import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryColumn({ name: 'cliente_ci', type: 'varchar', length: 20 })
  clienteCi: string;

  @Column({ name: 'cliente_nombre', type: 'varchar', length: 100 })
  clienteNombre: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;
}