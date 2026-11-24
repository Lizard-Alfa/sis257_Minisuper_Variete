import { Injectable } from '@nestjs/common';
import { CreateDetallesPromocioneDto } from './dto/create-detalles-promocione.dto';
import { UpdateDetallesPromocioneDto } from './dto/update-detalles-promocione.dto';

@Injectable()
export class DetallesPromocionesService {
  create(createDetallesPromocioneDto: CreateDetallesPromocioneDto) {
    return 'This action adds a new detallesPromocione';
  }

  findAll() {
    return `This action returns all detallesPromociones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallesPromocione`;
  }

  update(id: number, updateDetallesPromocioneDto: UpdateDetallesPromocioneDto) {
    return `This action updates a #${id} detallesPromocione`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallesPromocione`;
  }
}
