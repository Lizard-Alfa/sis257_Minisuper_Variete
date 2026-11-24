import { Module } from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { PromocionesController } from './promociones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promocion } from './entities/promocion.entity';
import { DetallePromo } from './entities/detalle-promo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promocion, DetallePromo])],
  controllers: [PromocionesController],
  providers: [PromocionesService],
})
export class PromocionesModule {}
