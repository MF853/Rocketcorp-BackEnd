import { PartialType } from '@nestjs/swagger';
import { CreateTrilhaDto } from './create-trilha.dto';

export class UpdateTrilhaDto extends PartialType(CreateTrilhaDto) {}
