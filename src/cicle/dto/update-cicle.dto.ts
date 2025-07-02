import { PartialType } from '@nestjs/swagger';
import { CreateCicleDto } from './create-cicle.dto';

export class UpdateCicleDto extends PartialType(CreateCicleDto) {}
