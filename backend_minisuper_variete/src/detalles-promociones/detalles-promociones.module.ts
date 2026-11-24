import { Module } from '@nestjs/common';
import { DetallesPromocionesService } from './detalles-promociones.service';
import { DetallesPromocionesController } from './detalles-promociones.controller';

@Module({
  controllers: [DetallesPromocionesController],
  providers: [DetallesPromocionesService],
})
export class DetallesPromocionesModule {}
