import { PartialType } from '@nestjs/swagger';
import { CreateDetallesPromocioneDto } from './create-detalles-promocione.dto';

export class UpdateDetallesPromocioneDto extends PartialType(CreateDetallesPromocioneDto) {}
