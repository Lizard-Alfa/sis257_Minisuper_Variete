import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePromocionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty({ description: 'Porcentaje de descuento (1 a 100)' })
  @IsNumber({}, { message: 'El descuento debe ser numérico' })
  @Min(1, { message: 'El descuento mínimo es 1%' })
  @Max(100, { message: 'El descuento máximo es 100%' })
  readonly descuento: number;

  @ApiProperty({ example: '2026-11-24' })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @IsDateString({}, { message: 'La fecha de inicio no es válida' })
  readonly fechaInicio: string;

  @ApiProperty({ example: '2026-11-30' })
  @IsNotEmpty({ message: 'La fecha fin es obligatoria' })
  @IsDateString({}, { message: 'La fecha fin no es válida' })
  readonly fechaFin: string;

  @ApiProperty()
  @IsBoolean({ message: 'aplicarATodos debe ser verdadero o falso' })
  readonly aplicarATodos: boolean;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray({ message: 'idProductos debe ser un arreglo' })
  @ArrayUnique({ message: 'Hay productos repetidos' })
  @IsInt({ each: true, message: 'Cada id de producto debe ser entero' })
  readonly idProductos: number[];
}
