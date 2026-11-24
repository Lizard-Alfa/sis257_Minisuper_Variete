import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Producto } from '../productos/entities/producto.entity';
import { VentaDetalle } from './entities/venta-detalle.entity';
import { Venta } from './entities/venta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, VentaDetalle, Producto, Cliente])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
