import { PartialType } from '@nestjs/swagger';
import { CreateEqualizacaoDto } from './create-equalizacao.dto';

export class UpdateEqualizacaoDto extends PartialType(CreateEqualizacaoDto) {}
