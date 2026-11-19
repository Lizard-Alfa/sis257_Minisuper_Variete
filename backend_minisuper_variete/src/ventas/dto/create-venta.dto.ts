import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateVentaDetalleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El id del producto es obligatorio' })
  @IsInt({ message: 'El id del producto debe ser de tipo numérico' })
  readonly idProducto: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  readonly cantidad: number;
}

export class CreateVentaDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'El id del cliente debe ser de tipo numérico' })
  readonly idCliente?: number;

  @ApiProperty({ enum: ['efectivo', 'tarjeta', 'qr'] })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  @IsString({ message: 'El método de pago debe ser de tipo cadena' })
  @IsIn(['efectivo', 'tarjeta', 'qr'], {
    message: 'El método de pago debe ser efectivo, tarjeta o qr',
  })
  readonly metodoPago: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser de tipo cadena' })
  @MaxLength(50, { message: 'Las observaciones no pueden tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly observaciones?: string;

  @ApiProperty({ type: [CreateVentaDetalleDto] })
  @IsArray({ message: 'Los productos deben ser una lista' })
  @ArrayMinSize(1, { message: 'La venta debe tener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  readonly detalles: CreateVentaDetalleDto[];
}
