import { ApiProperty } from '@nestjs/swagger';
<<<<<<< HEAD
import { Type } from 'class-transformer';
=======
import { Transform, Type } from 'class-transformer';
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
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
<<<<<<< HEAD
  @IsInt()
  readonly idProducto: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
=======
  @IsNotEmpty({ message: 'El id del producto es obligatorio' })
  @IsInt({ message: 'El id del producto debe ser de tipo numérico' })
  readonly idProducto: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
  readonly cantidad: number;
}

export class CreateVentaDto {
<<<<<<< HEAD
  @ApiProperty({ required: false, default: '0' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  readonly clienteCi?: string;

  @ApiProperty({ required: false, default: 'Cliente Ocasional' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly clienteNombre?: string;

  @ApiProperty({ enum: ['efectivo', 'tarjeta', 'qr'], default: 'efectivo' })
  @IsOptional()
  @IsString()
  @IsIn(['efectivo', 'tarjeta', 'qr'])
  readonly metodoPago?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly montoPagado?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly observaciones?: string;

  @ApiProperty({ type: [CreateVentaDetalleDto] })
  @IsArray()
  @ArrayMinSize(1)
=======
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
>>>>>>> 59d82a3d17e1d8b5ba45c9590f2f415e1d0fa8b1
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  readonly detalles: CreateVentaDetalleDto[];
}
