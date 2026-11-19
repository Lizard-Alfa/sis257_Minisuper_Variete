import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El ci o nit  es obligatorio' })
  @IsString({ message: 'El ci o nit debe ser de tipo cadena' })
  @MaxLength(15, { message: 'El ci nit  no puede tener más de 15 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nitCi: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre  es obligatorio' })
  @IsString({ message: 'El nombre debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El nombre  no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nombres: string;

  @ApiProperty()
  @IsString({ message: 'El apellido debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly apllidos: string;

  @ApiProperty()
  @IsString({ message: 'El telefono debe ser de tipo cadena' })
  @MaxLength(15, { message: 'El telefono no puede tener más de 15 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  telefono: string;
}
