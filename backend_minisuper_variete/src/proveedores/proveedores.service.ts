import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProveedoresService {
  constructor(@InjectRepository(Proveedor) private proveedoresRepository: Repository<Proveedor>) {}
  async create(createProveedoreDto: CreateProveedoreDto): Promise<Proveedor> {
    let proveedor = await this.proveedoresRepository.findOneBy({
      nitCi: createProveedoreDto.nitCi,
    });
    if (proveedor) throw new ConflictException('El proveedor ya existe');

    proveedor = new Proveedor();
    Object.assign(proveedor, createProveedoreDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return this.proveedoresRepository.find();
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOneBy({ id });
    if (!proveedor) throw new NotFoundException('El proveedor no existe');
    return proveedor;
  }

  async update(id: number, updateProveedoreDto: UpdateProveedoreDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    Object.assign(proveedor, updateProveedoreDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async remove(id: number): Promise<Proveedor> {
     const proveedor = await this.findOne(id);
     return this.proveedoresRepository.softRemove(proveedor);
  }
}
