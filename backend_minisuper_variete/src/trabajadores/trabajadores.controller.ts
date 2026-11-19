import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TrabajadoresService } from './trabajadores.service';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trabajadores')
export class TrabajadoresController {
  constructor(private readonly trabajadoresService: TrabajadoresService) {}

  @Post()
  create(@Body() createTrabajadoreDto: CreateTrabajadorDto) {
    return this.trabajadoresService.create(createTrabajadoreDto);
  }

  @Get()
  findAll() {
    return this.trabajadoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trabajadoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrabajadoreDto: CreateTrabajadorDto) {
    return this.trabajadoresService.update(+id, updateTrabajadoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trabajadoresService.remove(+id);
  }
}
