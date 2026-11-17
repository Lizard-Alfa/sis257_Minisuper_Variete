import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta, TipoCliente } from './entities/venta.entity';
import { VentaDetalle } from './entities/venta-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta) private ventasRepo: Repository<Venta>,
    @InjectRepository(VentaDetalle) private detallesRepo: Repository<VentaDetalle>,
    @InjectRepository(Producto) private productosRepo: Repository<Producto>,
    @InjectRepository(Cliente) private clientesRepo: Repository<Cliente>,
  ) {}

  async create(dto: CreateVentaDto, usuario: Usuario): Promise<Venta> {
    let total = 0;
    const detalles: VentaDetalle[] = [];

    for (const item of dto.detalles) {
      const producto = await this.productosRepo.findOneBy({ id: item.idProducto });
      if (!producto) throw new NotFoundException(`Producto ID ${item.idProducto} no existe`);

      const precio = parseFloat(producto.precio as unknown as string);
      const subtotal = precio * item.cantidad;
      total += subtotal;

      detalles.push(
        this.detallesRepo.create({
          producto,
          cantidad: item.cantidad,
          precioUnitario: precio,
          subtotal,
        }),
      );
    }

    const iva = total * 13 / 113;
    const subtotal = total - iva;
    const cambio = dto.montoPagado - total;

    let cliente: Cliente | null = null;
    let clienteNombre = 'Consumidor Final';
    let tipoCliente: TipoCliente = TipoCliente.OCASIONAL;

    if (dto.clienteCi && dto.clienteCi !== '0' && dto.clienteCi !== 'S/N') {
      cliente = await this.clientesRepo.findOneBy({ clienteCi: dto.clienteCi });
      if (cliente) {
        clienteNombre = cliente.clienteNombre;
        tipoCliente = TipoCliente.REGULAR;
      }
    }

    const venta = this.ventasRepo.create({
      total,
      subtotal,
      iva,
      montoPagado: dto.montoPagado,
      cambio,
      observaciones: dto.observaciones,
      metodoPago: dto.metodoPago,
      clienteNombre,
      tipoCliente,
      cliente: cliente || undefined,
      usuario,
    });

    return this.ventasRepo.save(venta);
  }

  findAll() {
    return this.ventasRepo.find({ relations: { detalles: { producto: true } } });
  }
}