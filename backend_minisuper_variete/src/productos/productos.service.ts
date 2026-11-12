import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
    @InjectRepository(Proveedor)
    private readonly proveedoresRepository: Repository<Proveedor>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    let producto = await this.productosRepository.findOneBy({
      codigo: createProductoDto.codigo,
    });
    if (producto) throw new ConflictException('El producto con ese código ya existe');

    const categoria = await this.categoriasRepository.findOneBy({
      id: createProductoDto.idCategoria,
    });
    if (!categoria) throw new NotFoundException('La categoría no existe');

    const proveedor = await this.proveedoresRepository.findOneBy({
      nitCi: createProductoDto.nitCiProveedor,
    });
    if (!proveedor) throw new NotFoundException('El proveedor no existe');

    producto = new Producto();
    producto.codigo = createProductoDto.codigo;
    producto.nombre = createProductoDto.nombre;
    producto.precio = createProductoDto.precio;
    producto.unidad_medida = createProductoDto.unidad_medida;
    producto.categoria = categoria;
    producto.proveedor = proveedor;

    return this.productosRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({
      relations: { categoria: true, proveedor: true },
      order: { nombre: 'ASC' },
    });
  }

  async findByCategoria(idCategoria: number): Promise<Producto[]> {
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
  }

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

    if (updateProductoDto.idCategoria !== undefined) {
      const categoria = await this.categoriasRepository.findOneBy({
        id: updateProductoDto.idCategoria,
      });
      if (!categoria) throw new NotFoundException('La categoría no existe');
      producto.categoria = categoria;
    }

    if (updateProductoDto.nitCiProveedor !== undefined) {
      const proveedor = await this.proveedoresRepository.findOneBy({
        nitCi: updateProductoDto.nitCiProveedor,
      });
      if (!proveedor) throw new NotFoundException('El proveedor no existe');
      producto.proveedor = proveedor;
    }

    if (updateProductoDto.codigo !== undefined) producto.codigo = updateProductoDto.codigo;
    if (updateProductoDto.nombre !== undefined) producto.nombre = updateProductoDto.nombre;
    if (updateProductoDto.precio !== undefined) producto.precio = updateProductoDto.precio;
    if (updateProductoDto.unidad_medida !== undefined)
      producto.unidad_medida = updateProductoDto.unidad_medida;

    return this.productosRepository.save(producto);
  }

  async remove(id: number): Promise<Producto> {
    const producto = await this.findOne(id);
    return this.productosRepository.softRemove(producto);
  }
}
