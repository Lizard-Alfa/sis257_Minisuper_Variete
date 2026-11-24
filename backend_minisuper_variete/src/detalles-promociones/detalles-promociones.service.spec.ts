import { Test, TestingModule } from '@nestjs/testing';
import { DetallesPromocionesService } from './detalles-promociones.service';

describe('DetallesPromocionesService', () => {
  let service: DetallesPromocionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetallesPromocionesService],
    }).compile();

    service = module.get<DetallesPromocionesService>(DetallesPromocionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
