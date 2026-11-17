import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { MetodoPago } from '../entities/venta.entity';

class DetalleDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  @Min(1, { message: 'El ID del producto debe ser mayor a 0' })
  idProducto: number;

  @ApiProperty({ example: 2 })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  cantidad: number;
}

export class CreateVentaDto {
  @ApiProperty({ type: [DetalleDto] })
  @IsArray({ message: 'Los detalles deben ser un arreglo' })
  @ArrayNotEmpty({ message: 'La venta debe tener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => DetalleDto)
  detalles: DetalleDto[];

  @ApiPropertyOptional({ example: '1234567' })
  @IsOptional()
  @IsString({ message: 'El CI debe ser tipo cadena' })
  @MaxLength(20, { message: 'El CI no puede tener más de 20 caracteres' })
  clienteCi?: string;

  @ApiProperty({ enum: MetodoPago, example: 'efectivo' })
  @IsEnum(MetodoPago, { message: 'El método de pago debe ser: efectivo, tarjeta o qr' })
  metodoPago: MetodoPago;

  @ApiProperty()
  @IsNumber({}, { message: 'El monto pagado debe ser un número' })
  @Min(0, { message: 'El monto pagado no puede ser negativo' })
  montoPagado: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser tipo cadena' })
  @MaxLength(500, { message: 'Las observaciones no pueden exceder 500 caracteres' })
  observaciones?: string;
}
