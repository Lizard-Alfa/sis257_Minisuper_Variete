import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    let producto = await this.productosRepository.findOneBy({
      codigo: createProductoDto.codigo,
      nombre: createProductoDto.nombre,
    });
    if (producto) throw new ConflictException('El pruducto ya existe');

    producto = new Producto();
    Object.assign(producto, createProductoDto);
    return this.productosRepository.save(producto);
  }

async findAll() {
  return await this.productosRepository.find({
    relations: { categoria: true, proveedor: true }, // 👈 Esto obliga al backend a traer el objeto completo
  });
}

  /*async findByCategoria(idCategoria: number): Promise<Producto[]> {
    return this.productosRepository.find({
      where: { categoria: { id: idCategoria } },
      relations: { categoria: true, proveedor: true },
      order: { nombre: 'ASC' },
    });
  }

  async findByProveedor(nitCiProveedor: string): Promise<Producto[]> {
    return this.productosRepository.find({
      where: { proveedor: { nitCi: nitCiProveedor } },
      relations: { categoria: true, proveedor: true },
      order: { nombre: 'ASC' },
    });
  }*/

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: { categoria: true, proveedor: true },
    });
    if (!producto) throw new NotFoundException('El producto no existe');
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return this.productosRepository.save(producto);
  }

  async remove(id: number): Promise<Producto> {
    const producto = await this.findOne(id);
    return this.productosRepository.softRemove(producto);
  }
}
