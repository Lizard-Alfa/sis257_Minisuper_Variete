import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Trabajador } from './entities/trabajador.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrabajadoresService {
  constructor(
    @InjectRepository(Trabajador) private trabajadoresRepository: Repository<Trabajador>,
  ) {}

  async create(createTrabajadoreDto: CreateTrabajadorDto): Promise<Trabajador> {
    let trabajador = await this.trabajadoresRepository.findOneBy({
      ci: createTrabajadoreDto.ci,
    });
    if (trabajador) throw new ConflictException('El trabajador ya existe');

    trabajador = new Trabajador();
    Object.assign(trabajador, createTrabajadoreDto);
    return this.trabajadoresRepository.save(trabajador);
  }

  async findAll(): Promise<Trabajador[]> {
    return this.trabajadoresRepository.find({ order: { nombres: 'ASC' } });
  }

  async findOne(id: number): Promise<Trabajador> {
    const trabajador = await this.trabajadoresRepository.findOneBy({ id });
    if (!trabajador) throw new NotFoundException('El trabajador no existe');
    return trabajador;
  }

  async update(id: number, updateTrabajadoreDto: CreateTrabajadorDto):Promise<Trabajador> {
    const trabajador = await this.findOne(id);
    Object.assign(trabajador, updateTrabajadoreDto);
    return this.trabajadoresRepository.save(trabajador);
  }

  async remove(id: number) : Promise<Trabajador> {
    const trabajador = await this.findOne(id);
    return this.trabajadoresRepository.softRemove(trabajador);
  }
}
