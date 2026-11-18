import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsDefined, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El codigo es obligatorio' })
  @IsString({ message: 'El codigo debe ser de tipo cadena' })
  @MaxLength(10, { message: 'El codigo no puede tener más de 10 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly codigo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty()
  @IsDefined({ message: 'El id de la categoria es obligatorio' })
  @IsInt({ message: 'El id de la categoria debe ser tipo numérico' })
  readonly idCategoria: number;

  @ApiProperty()
  @IsDefined({ message: 'El id del proveedor es obligatorio' })
  @IsInt({ message: 'El id del proveedo debe ser tipo numérico' })
  readonly idProveedor: number;

  @ApiProperty()
  @IsString({ message: 'La imagen debe ser de tipo cadena' })
  @MaxLength(500, { message: 'El nombre no puede tener más de 500 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly imagen: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La unida de medida es obligatorio' })
  @IsString({ message: 'La unida de medida debe ser de tipo cadena' })
  @MaxLength(50, { message: 'La unida de medida no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly unidadMedida: string;

  @ApiProperty()
  @IsDefined({ message: 'El stock es obligatorio' })
  @IsInt({ message: 'El stock  debe ser tipo numérico' })
  readonly stock: number;

  @ApiProperty()
  @IsInt({ message: 'El stock  debe ser tipo numérico' })
  readonly stockMinimo: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo precio es obligatorio' })
  @IsNumber({}, { message: 'El campo precio debe ser de tipo número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  readonly precio: number;

  @ApiProperty()
  @IsNumber({}, { message: 'El campo precio descuento debe ser de tipo número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precioDescuento: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de descuento inicio debe ser de tipo fecha' })
  descuentoInicio: Date| null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de descuento final debe ser de tipo fecha' })
  descuentoFin: Date|null;
}
