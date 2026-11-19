import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Venta } from './entities/venta.entity';
import { VentaDetalle } from './entities/venta-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';

const redondear = (n: number) => Math.round(n * 100) / 100;

@Injectable()
export class VentasService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Venta) private readonly ventasRepo: Repository<Venta>,
  ) {}

  async create(dto: CreateVentaDto, idUsuario: number): Promise<Venta> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Determinar cliente
      const esOcasional = !dto.clienteCi || dto.clienteCi === '0' || dto.clienteCi === 'S/N';
      const clienteCi = esOcasional ? '0' : dto.clienteCi;
      const clienteNombre = esOcasional ? 'Cliente Ocasional' : dto.clienteNombre || 'Cliente Ocasional';
      const tipoCliente = esOcasional ? 'ocasional' : 'regular';

      // 2. Unir productos repetidos
      const cantidades = new Map<number, number>();
      for (const d of dto.detalles) {
        cantidades.set(d.idProducto, (cantidades.get(d.idProducto) ?? 0) + d.cantidad);
      }

      // 3. Traer productos
      const productos = await manager.find(Producto, {
        where: { id: In([...cantidades.keys()]) },
        order: { id: 'ASC' },
        lock: { mode: 'pessimistic_write' },
      });

      if (productos.length !== cantidades.size) {
        throw new NotFoundException('Uno o más productos no existen');
      }

      // 4. Validar stock y calcular totales
      let subtotal = 0;
      const detalles: Partial<VentaDetalle>[] = [];

      for (const producto of productos) {
        const cantidad = cantidades.get(producto.id)!;
        if (producto.stock < cantidad) {
          throw new BadRequestException(`Stock insuficiente para ${producto.nombre}`);
        }

        const precioUnitario = Number(producto.precio);
        const subtotalDetalle = redondear(precioUnitario * cantidad);
        subtotal += subtotalDetalle;

        detalles.push({
          idProducto: producto.id,
          cantidad,
          precioUnitario,
          subtotal: subtotalDetalle,
        });

        producto.stock -= cantidad;
      }

      await manager.save(productos);

      // 5. Calcular IVA y total
      subtotal = redondear(subtotal);
      const iva = redondear(subtotal * 0.13);
      const total = redondear(subtotal + iva);
      const montoPagado = dto.montoPagado ? Number(dto.montoPagado) : total;

      if (montoPagado < total) {
        throw new BadRequestException('Monto pagado insuficiente');
      }

      const cambio = redondear(montoPagado - total);

      // 6. Guardar venta
      const venta = await manager.save(
        manager.create(Venta, {
          transaccion: randomUUID().slice(0, 15),
          idUsuario,
          clienteCi,
          clienteNombre,
          tipoCliente,
          metodoPago: dto.metodoPago || 'efectivo',
          subtotal,
          iva,
          total,
          montoPagado,
          cambio,
          observaciones: dto.observaciones ?? null,
          estado: 'activa',
        }),
      );

      // 7. Número correlativo
      venta.transaccion = `V-${String(venta.id).padStart(6, '0')}`;
      await manager.save(venta);

      // 8. Guardar detalles
      await manager.save(
        detalles.map((d) => manager.create(VentaDetalle, { ...d, idVenta: venta.id })),
      );

      return manager.findOneOrFail(Venta, {
        where: { id: venta.id },
        relations: { cliente: true, usuario: true, detalles: { producto: true } },
      });
    });
  }

  async findAll(desde?: string, hasta?: string, estado?: string): Promise<Venta[]> {
    const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' });
    const fechaDesde = desde ?? hoy;
    const fechaHasta = hasta ?? fechaDesde;

    const formato = /^\d{4}-\d{2}-\d{2}$/;
    if (!formato.test(fechaDesde) || !formato.test(fechaHasta)) {
      throw new BadRequestException('Formato de fecha inválido (AAAA-MM-DD)');
    }

    if (estado && !['activa', 'anulada'].includes(estado)) {
      throw new BadRequestException('Estado debe ser activa o anulada');
    }

    const inicio = new Date(`${fechaDesde}T00:00:00.000-04:00`);
    const fin = new Date(`${fechaHasta}T23:59:59.999-04:00`);

    return this.ventasRepo.find({
      where: {
        fechaCreacion: Between(inicio, fin),
        ...(estado ? { estado } : {}),
      },
      relations: { cliente: true, usuario: true },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventasRepo.findOne({
      where: { id },
      relations: { cliente: true, usuario: true, detalles: { producto: true } },
      withDeleted: true,
    });

    if (!venta) throw new NotFoundException('Venta no existe');
    return venta;
  }

  async anular(id: number): Promise<Venta> {
    await this.dataSource.transaction(async (manager) => {
      const venta = await manager.findOne(Venta, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!venta) throw new NotFoundException('Venta no existe');
      if (venta.estado === 'anulada') {
        throw new BadRequestException('Venta ya está anulada');
      }

      const detalles = await manager.find(VentaDetalle, { where: { idVenta: id } });
      for (const d of detalles) {
        await manager.increment(Producto, { id: d.idProducto }, 'stock', d.cantidad);
      }

      venta.estado = 'anulada';
      await manager.save(venta);
    });

    return this.findOne(id);
  }
}