import { PartialType } from "@nestjs/swagger";
import {
  CreateAvaliacaoDto,
  CreateAvaliacao360Dto,
} from "./create-avaliacao.dto";

export class UpdateAvaliacaoDto extends PartialType(CreateAvaliacaoDto) {}
export class UpdateAvaliacao360Dto extends PartialType(CreateAvaliacao360Dto) {}
