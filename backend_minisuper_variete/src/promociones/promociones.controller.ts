import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PromocionesService } from './promociones.service';
//import { UpdatePromocioneDto } from './dto/update-promocione.dto';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('promociones')
export class PromocionesController {
  constructor(private readonly promocionesService: PromocionesService) {}

  @Post()
  create(@Body() createPromocionDto: CreatePromocionDto, @Req() req: { user: Usuario }) {
    return this.promocionesService.create(createPromocionDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.promocionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.findOne(id);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.cancelar(id);
  }

  /*@Delete(':id')
  remove(@Param('id') id: string) {
    return this.promocionesService.remove(+id);
  }*/
}
