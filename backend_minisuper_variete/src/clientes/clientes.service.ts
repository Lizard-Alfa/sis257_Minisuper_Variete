import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
<<<<<<< HEAD
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
=======
  constructor(@InjectRepository(Cliente) private clientesRepository: Repository<Cliente>) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    let cliente = await this.clientesRepository.findOneBy({
      nitCi: createClienteDto.nitCi,
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
    });
    if (cliente) throw new ConflictException('El ci o nit ya existe');
    cliente = new Cliente();
    Object.assign(cliente, createClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepository.find({ order: { nombres: 'ASC' } });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOneBy({ id });
    if (!cliente) throw new NotFoundException('La cliente no existe');
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);
    Object.assign(cliente, updateClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async remove(id: number): Promise<Cliente> {
    const cliente = await this.findOne(id);
    return this.clientesRepository.softRemove(cliente);
  }
}