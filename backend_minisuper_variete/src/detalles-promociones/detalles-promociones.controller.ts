import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallesPromocionesService } from './detalles-promociones.service';
import { CreateDetallesPromocioneDto } from './dto/create-detalles-promocione.dto';
import { UpdateDetallesPromocioneDto } from './dto/update-detalles-promocione.dto';

@Controller('detalles-promociones')
export class DetallesPromocionesController {
  constructor(private readonly detallesPromocionesService: DetallesPromocionesService) {}

  @Post()
  create(@Body() createDetallesPromocioneDto: CreateDetallesPromocioneDto) {
    return this.detallesPromocionesService.create(createDetallesPromocioneDto);
  }

  @Get()
  findAll() {
    return this.detallesPromocionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesPromocionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallesPromocioneDto: UpdateDetallesPromocioneDto) {
    return this.detallesPromocionesService.update(+id, updateDetallesPromocioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesPromocionesService.remove(+id);
  }
}
