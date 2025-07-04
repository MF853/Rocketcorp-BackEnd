import { PartialType } from '@nestjs/swagger';
import { CreateResumoiaDto } from './create-resumoia.dto';

export class UpdateResumoiaDto extends PartialType(CreateResumoiaDto) {}
