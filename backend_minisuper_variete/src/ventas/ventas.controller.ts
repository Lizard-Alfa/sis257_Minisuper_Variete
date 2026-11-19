import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Usuario } from '../usuarios/entities/usuario.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
<<<<<<< HEAD
  create(@Body() dto: CreateVentaDto, @Req() req: { user: Usuario }) {
    return this.ventasService.create(dto, req.user.id);
  }

  @Get()
  @ApiQuery({ name: 'desde', required: false })
  @ApiQuery({ name: 'hasta', required: false })
  @ApiQuery({ name: 'estado', required: false })
  findAll(@Query('desde') desde?: string, @Query('hasta') hasta?: string, @Query('estado') estado?: string) {
=======
  create(@Body() createVentaDto: CreateVentaDto, @Req() req: { user: Usuario }) {
    return this.ventasService.create(createVentaDto, req.user.idTrabajador);
  }

  @Get()
  @ApiQuery({ name: 'desde', required: false, example: '2026-11-18' })
  @ApiQuery({ name: 'hasta', required: false, example: '2026-11-18' })
  @ApiQuery({ name: 'estado', required: false, enum: ['activa', 'anulada'] })
  findAll(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('estado') estado?: string,
  ) {
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
    return this.ventasService.findAll(desde, hasta, estado);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @Patch(':id/anular')
  anular(@Param('id') id: string) {
    return this.ventasService.anular(+id);
  }
}