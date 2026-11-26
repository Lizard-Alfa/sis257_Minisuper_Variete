import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { TrabajadoresModule } from './trabajadores/trabajadores.module';
import { VentasModule } from './ventas/ventas.module';
import { PromocionesModule } from './promociones/promociones.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT ?? ''),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProveedoresModule,
    CategoriasModule,
    ProductosModule,
    UsuariosModule,
    TrabajadoresModule,
    ClientesModule,
    AuthModule,
    VentasModule,
    PromocionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
