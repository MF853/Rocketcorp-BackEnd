import { PartialType } from '@nestjs/mapped-types';
import { CreateAvaliacaoDto, CreateAvaliacao360Dto, CreateAvaliacaoAbstrataDto } from './create-avaliacao.dto';

export class UpdateAvaliacaoDto extends PartialType(CreateAvaliacaoDto) {}
export class UpdateAvaliacao360Dto extends PartialType(CreateAvaliacao360Dto) {}
export class UpdateAvaliacaoAbstrataDto extends PartialType(CreateAvaliacaoAbstrataDto) {}
