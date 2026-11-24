import { Test, TestingModule } from '@nestjs/testing';
import { DetallesPromocionesController } from './detalles-promociones.controller';
import { DetallesPromocionesService } from './detalles-promociones.service';

describe('DetallesPromocionesController', () => {
  let controller: DetallesPromocionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallesPromocionesController],
      providers: [DetallesPromocionesService],
    }).compile();

    controller = module.get<DetallesPromocionesController>(DetallesPromocionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
