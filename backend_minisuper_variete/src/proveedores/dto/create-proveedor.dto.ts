import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El Nit o Ci es obligatorio' })
  @IsString({ message: 'El Nit o Ci debe ser tipo cadena' })
  @MaxLength(20, { message: 'El Nit o Ci no puede tener mas de 20 caracters' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nitCi: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser tipo cadena' })
  @MaxLength(50, { message: 'El nombre no puede tener mas de 50 caracters' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nombres: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser tipo cadena' })
  @MaxLength(50, { message: 'El apellido no puede tener mas de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly apellidos: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El telefono  es obligatorio' })
  @IsString({ message: 'El telefono debe ser tipo cadena' })
  @MaxLength(20, { message: 'El telefono no puede tener mas de 20 caracters' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly telefono: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La dirreccion es obligatoria' })
  @IsString({ message: 'La direccion debe ser tipo cadena' })
  @MaxLength(50, { message: 'La direccion no puede tener mas de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly direccion: string;

@ApiProperty()
@IsNotEmpty({ message: 'El email es obligatorio' })
@IsEmail({}, { message: 'El email debe tener un formato válido (ej: usuario@dominio.com)' })
@MaxLength(30, { message: 'El email no puede tener más de 30 caracteres' })
@Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim().toLowerCase() : value))
readonly email: string;
}
