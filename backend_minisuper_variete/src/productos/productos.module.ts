import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Categoria, Proveedor])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}