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
<<<<<<< HEAD
//import { TrabajadoresModule } from './trabajadores/trabajadores.module';
=======
import { TrabajadoresModule } from './trabajadores/trabajadores.module';
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
<<<<<<< HEAD
    //TrabajadoresModule,
=======
    TrabajadoresModule,
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
    ClientesModule,
    AuthModule,
    VentasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
