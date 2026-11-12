import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser tipo cadena' })
  @MaxLength(10, { message: 'El código no puede tener más de 10 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly codigo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser tipo cadena' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty({ description: 'ID de la categoría del producto' })
  @IsDefined({ message: 'El id de la categoría es obligatorio' })
  @IsInt({ message: 'El id de la categoría debe ser tipo numérico' })
  readonly idCategoria: number;

  @ApiProperty({ description: 'NIT o CI del proveedor del producto' })
  @IsDefined({ message: 'El NIT/CI del proveedor es obligatorio' })
  @IsString({ message: 'El NIT/CI del proveedor debe ser tipo cadena' })
  @MaxLength(20, { message: 'El NIT/CI del proveedor no puede tener más de 20 caracteres' })
  readonly nitCiProveedor: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número decimal con máximo 2 decimales' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  readonly precio: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'La unidad de medida es obligatoria' })
  @IsString({ message: 'La unidad de medida debe ser tipo cadena' })
  @MaxLength(20, { message: 'La unidad de medida no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly unidad_medida: string;
}
