import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Like } from 'typeorm';

@Injectable()
export class ClientesService {
  constructor(@InjectRepository(Cliente) private clientesRepo: Repository<Cliente>) {}

  create(dto: CreateClienteDto) {
    const cliente = this.clientesRepo.create(dto);
    return this.clientesRepo.save(cliente);
  }

  findAll() {
    return this.clientesRepo.find();
  }

  findOne(clienteCi: string) {
    return this.clientesRepo.findOneBy({ clienteCi });
  }

  update(clienteCi: string, dto: UpdateClienteDto) {
    return this.clientesRepo.update({ clienteCi }, dto);
  }

  remove(clienteCi: string) {
    return this.clientesRepo.delete({ clienteCi });
  }

  async buscarPorCi(ci: string) {
    return this.clientesRepo.find({
      where: { clienteCi: Like(`%${ci}%`) },
      take: 10,
    });
  }
}
