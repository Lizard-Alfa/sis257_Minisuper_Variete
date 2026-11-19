import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Venta } from './entities/venta.entity';
import { VentaDetalle } from './entities/venta-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

const CLIENTE_GENERICO_ID = 3;

const redondear = (n: number): number => Math.round(n * 100) / 100;

// Evita que se filtre el hash de la clave del usuario
const limpiar = (v: Venta): Venta => {
  if (v.usuario) v.usuario = { id: v.usuario.id, usuario: v.usuario.usuario } as Usuario;
  return v;
};

@Injectable()
export class VentasService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Venta) private readonly ventasRepository: Repository<Venta>,
  ) {}

  async create(dto: CreateVentaDto, idUsuario: number): Promise<Venta> {
    const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' });

    return this.dataSource.transaction(async (manager) => {
      // 1. Cliente (genérico si no viene)
      const idCliente = dto.idCliente ?? CLIENTE_GENERICO_ID;
      const cliente = await manager.findOneBy(Cliente, { id: idCliente });
      if (!cliente) throw new NotFoundException('El cliente no existe');

      // 2. Unir productos repetidos
      const cantidades = new Map<number, number>();
      for (const d of dto.detalles) {
        cantidades.set(d.idProducto, (cantidades.get(d.idProducto) ?? 0) + d.cantidad);
      }

      // 3. Traer productos bloqueados
      const productos = await manager.find(Producto, {
        where: { id: In([...cantidades.keys()]) },
        order: { id: 'ASC' },
        lock: { mode: 'pessimistic_write' },
      });
      if (productos.length !== cantidades.size) {
        throw new NotFoundException('Uno o más productos no existen');
      }

      // 4. Validar stock y calcular precios
      let total = 0;
      const detalles: Partial<VentaDetalle>[] = [];

      for (const producto of productos) {
        const cantidad = cantidades.get(producto.id)!;

        if (producto.stock < cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para ${producto.nombre}: disponible ${producto.stock}`,
          );
        }

        const precioNormal = Number(producto.precio);
        const precioDesc = Number(producto.precioDescuento);
        const inicio = producto.descuentoInicio
          ? String(producto.descuentoInicio).slice(0, 10)
          : null;
        const fin = producto.descuentoFin ? String(producto.descuentoFin).slice(0, 10) : null;

        const descuentoVigente =
          precioDesc > 0 &&
          precioDesc < precioNormal &&
          inicio !== null &&
          fin !== null &&
          inicio <= hoy &&
          hoy <= fin;

        const precioUnitario = descuentoVigente ? precioDesc : precioNormal;
        const descuentoMonto = descuentoVigente
          ? redondear((precioNormal - precioDesc) * cantidad)
          : 0;
        const subtotal = redondear(precioUnitario * cantidad);

        total += subtotal;
        detalles.push({ idProducto: producto.id, cantidad, precioUnitario, descuentoMonto, subtotal });

        // 5. Descontar stock
        producto.stock -= cantidad;
      }
      await manager.save(productos);

      total = redondear(total);

      // 6. Guardar la venta (transacción temporal)
      const venta = await manager.save(
        manager.create(Venta, {
          transaccion: randomUUID().slice(0, 15),
          idUsuario,
          idCliente,
          metodoPago: dto.metodoPago,
          observaciones: dto.observaciones ?? null,
          subtotal: total,
          total,
          estado: 'activa',
        }),
      );

      // 7. Número correlativo: V-000001
      venta.transaccion = `V-${String(venta.id).padStart(6, '0')}`;
      await manager.save(venta);

      // 8. Guardar detalles
      await manager.save(
        detalles.map((d) => manager.create(VentaDetalle, { ...d, idVenta: venta.id })),
      );

      // 9. Devolver la venta completa
      return limpiar(
        await manager.findOneOrFail(Venta, {
          where: { id: venta.id },
          relations: { cliente: true, usuario: true, detalles: { producto: true } },
        }),
      );
    });
  }

  async findAll(desde?: string, hasta?: string, estado?: string): Promise<Venta[]> {
    const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' });
    const fechaDesde = desde ?? hoy;
    const fechaHasta = hasta ?? fechaDesde;

    const formato = /^\d{4}-\d{2}-\d{2}$/;
    if (!formato.test(fechaDesde) || !formato.test(fechaHasta)) {
      throw new BadRequestException('Las fechas deben tener el formato AAAA-MM-DD');
    }
    if (estado && !['activa', 'anulada'].includes(estado)) {
      throw new BadRequestException('El estado debe ser activa o anulada');
    }

    const inicio = new Date(`${fechaDesde}T00:00:00.000-04:00`);
    const fin = new Date(`${fechaHasta}T23:59:59.999-04:00`);

    const ventas = await this.ventasRepository.find({
      where: {
        fechaCreacion: Between(inicio, fin),
        ...(estado ? { estado } : {}),
      },
      relations: { cliente: true, usuario: true },
      order: { fechaCreacion: 'DESC' },
    });
    return ventas.map(limpiar);
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: { cliente: true, usuario: true, detalles: { producto: true } },
      withDeleted: true,
    });
    if (!venta) throw new NotFoundException('La venta no existe');
    return limpiar(venta);
  }

  async anular(id: number): Promise<Venta> {
    await this.dataSource.transaction(async (manager) => {
      const venta = await manager.findOne(Venta, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!venta) throw new NotFoundException('La venta no existe');
      if (venta.estado === 'anulada') {
        throw new BadRequestException('La venta ya está anulada');
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