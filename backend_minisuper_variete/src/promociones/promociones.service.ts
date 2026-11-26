import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, LessThan, Repository } from 'typeorm';
import { Producto } from '../productos/entities/producto.entity';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { DetallePromo } from './entities/detalle-promo.entity';
import { Promocion } from './entities/promocion.entity';
import { Cron } from '@nestjs/schedule';

const hoy = (): string => new Date().toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' }); // YYYY-MM-DD

@Injectable()
export class PromocionesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Promocion) private promocionesRepository: Repository<Promocion>,
  ) {}

  async create(createPromocionDto: CreatePromocionDto, idUsuario: number) {
    const dto = createPromocionDto;
    const inicio = dto.fechaInicio.slice(0, 10);
    const fin = dto.fechaFin.slice(0, 10);

    if (fin < inicio) {
      throw new BadRequestException('La fecha fin no puede ser menor que la fecha inicio');
    }
    if (!dto.aplicarATodos && !dto.idProductos?.length) {
      throw new BadRequestException('Selecciona al menos un producto o aplica a todos');
    }

    return this.dataSource.transaction(async em => {
      const productos = dto.aplicarATodos
        ? await em.find(Producto)
        : await em.find(Producto, { where: { id: In(dto.idProductos!) } });
      if (!productos.length) throw new NotFoundException('No se encontraron productos');

      // Productos que ya están en una promo activa cuyas fechas se cruzan
      const rows = await em
        .createQueryBuilder(DetallePromo, 'd')
        .innerJoin('d.promocion', 'p')
        .select('d.idProducto', 'idProducto')
        .where('p.estado = :estado', { estado: 'activo' })
        .andWhere('p.fechaInicio <= :fin', { fin })
        .andWhere('p.fechaFin >= :inicio', { inicio })
        .getRawMany();
      const ocupados = new Set(rows.map(r => Number(r.idProducto)));

      const libres = productos.filter(p => !ocupados.has(p.id));
      const omitidos = productos
        .filter(p => ocupados.has(p.id))
        .map(p => ({ id: p.id, codigo: p.codigo, nombre: p.nombre }));

      if (!libres.length) {
        throw new ConflictException({
          message: 'Todos los productos ya están en otra promoción en esas fechas',
          omitidos,
        });
      }

      const promo = await em.save(
        em.create(Promocion, {
          nombre: dto.nombre,
          idUsuario,
          tipo: dto.aplicarATodos ? 'global' : 'seleccionados',
          descuento: dto.descuento,
          fechaInicio: inicio,
          fechaFin: fin,
          estado: 'activo',
        }),
      );

      const detalles = libres.map(p => {
        const original = Number(p.precio);
        return em.create(DetallePromo, {
          idPromocion: promo.id,
          idProducto: p.id,
          precioOriginal: original,
          precioDescuento: +(original * (1 - dto.descuento / 100)).toFixed(2),
        });
      });
      await em.save(detalles);

      return { promocion: promo, aplicados: libres.length, omitidos };
    });
  }

  async findAll(): Promise<Promocion[]> {
    return this.promocionesRepository.find({
      relations: { usuario: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Promocion> {
    const promo = await this.promocionesRepository.findOne({
      where: { id },
      relations: { usuario: true, detalles: { producto: true } },
    });
    if (!promo) throw new NotFoundException('La promoción no existe');
    return promo;
  }

  async cancelar(id: number): Promise<Promocion> {
    const promo = await this.findOne(id);
    if (promo.estado !== 'activo') {
      throw new BadRequestException('Solo se puede cancelar una promoción activa');
    }
    promo.estado = 'cancelado';
    return this.promocionesRepository.save(promo);
  }

  // Marca como concluidas las vencidas, todos los días a las 00:00'
  // LessThan, LessThanOrEqual
  @Cron('0 0 * * *', { timeZone: 'America/La_Paz' })
  async concluirVencidas() {
    await this.promocionesRepository.update(
      { estado: 'activo', fechaFin: LessThan(hoy()) },
      { estado: 'concluido' },
    );
  }

  // Para Ventas: promo vigente de cada producto (mapa idProducto -> detalle)
  async vigentesPorProducto(ids: number[], em: EntityManager) {
    const mapa = new Map<number, DetallePromo>();
    if (!ids.length) return mapa;

    const rows = await em
      .createQueryBuilder(DetallePromo, 'd')
      .innerJoinAndSelect('d.promocion', 'p')
      .where('d.idProducto IN (:...ids)', { ids })
      .andWhere('p.estado = :estado', { estado: 'activo' })
      .andWhere(':hoy BETWEEN p.fechaInicio AND p.fechaFin', { hoy: hoy() })
      .getMany();

    rows.forEach(r => mapa.set(r.idProducto, r));
    return mapa;
  }
  

}
