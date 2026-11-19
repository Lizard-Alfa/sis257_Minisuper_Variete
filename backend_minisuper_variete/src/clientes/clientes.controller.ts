import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get('buscar')
  async buscarPorCi(@Query('ci') ci: string) {
    return this.clientesService.buscarPorCi(ci);
  }

  @Get(':clienteCi')
  findOne(@Param('clienteCi') clienteCi: string) {
    return this.clientesService.findOne(clienteCi);
  }

  @Patch(':clienteCi')
  update(@Param('clienteCi') clienteCi: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(clienteCi, updateClienteDto);
  }

  @Delete(':clienteCi')
  remove(@Param('clienteCi') clienteCi: string) {
    return this.clientesService.remove(clienteCi);
  }
}