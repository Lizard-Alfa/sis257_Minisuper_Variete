import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente) private readonly clientesRepo: Repository<Cliente>,
  ) {}

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clientesRepo.create(dto);
    return this.clientesRepo.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(clienteCi: string): Promise<Cliente> {
    const cliente = await this.clientesRepo.findOneBy({ clienteCi });
    if (!cliente) {
      throw new NotFoundException(`Cliente con CI ${clienteCi} no encontrado`);
    }
    return cliente;
  }

  async update(clienteCi: string, dto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(clienteCi);
    Object.assign(cliente, dto);
    return this.clientesRepo.save(cliente);
  }

  async remove(clienteCi: string): Promise<void> {
    const cliente = await this.findOne(clienteCi);
    await this.clientesRepo.remove(cliente);
  }

  async buscarPorCi(ci: string): Promise<Cliente[]> {
    return this.clientesRepo.find({
      where: { clienteCi: Like(`%${ci}%`) },
      take: 10,
    });
  }
}