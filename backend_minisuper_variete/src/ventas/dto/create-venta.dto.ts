import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateVentaDetalleDto {
  @ApiProperty()
  @IsInt()
  readonly idProducto: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  readonly cantidad: number;
}

export class CreateVentaDto {
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
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  readonly detalles: CreateVentaDetalleDto[];
}
