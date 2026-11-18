import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTrabajadorDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El ci es obligatorio' })
  @IsString({ message: 'El ci debe ser de tipo cadena' })
  @MaxLength(15, { message: 'El ci no puede tener más de 15 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly ci: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly nombres: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El apellodo es obligatorio' })
  @IsString({ message: 'El apellido debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly apellidos: string;

  @ApiProperty()
  @IsString({ message: 'El telefono debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El telefono no puede tener más de 20 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly telefono: string;

  @ApiProperty()
  @IsString({ message: 'La direccion debe ser de tipo cadena' })
  @MaxLength(50, { message: 'La direccion no puede tener más de 50 caracteres' })
  @Transform(({ value }): string | undefined => (typeof value == 'string' ? value.trim() : value))
  readonly direccion: string;
}
