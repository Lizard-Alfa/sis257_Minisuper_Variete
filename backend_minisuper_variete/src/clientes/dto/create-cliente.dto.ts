import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El CI es obligatorio' })
  @IsString()
  @MaxLength(20)
  readonly clienteCi: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(100)
  readonly clienteNombre: string;

  @ApiPropertyOptional()
  @IsOptional({ message: 'El telefono es opcional' })
  @IsString()
  @MaxLength(20)
  readonly telefono?: string;
}