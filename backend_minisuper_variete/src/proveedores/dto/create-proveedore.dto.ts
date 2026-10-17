import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProveedoreDto {
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
  @MaxLength(50, { message: 'El apellido no puede tener mas de 50 caracters' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly apellidos: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El telefono  es obligatorio' })
  @IsString({ message: 'El telefono debe ser tipo cadena' })
  @MaxLength(20, { message: 'El telefono no puede tener mas de 20 caracters' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly telefono: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La dirreccion es obligatorio' })
  @IsString({ message: 'La direccion debe ser tipo cadena' })
  @MaxLength(50, { message: 'La dereccion no puede tener mas de 50 caracters' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly direccion: string;

  @ApiProperty()
  @IsString({ message: 'El email debe ser tipo cadena' })
  @MaxLength(30, { message: 'El email no puede tener mas de 30 caracters' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly email: string;
}
