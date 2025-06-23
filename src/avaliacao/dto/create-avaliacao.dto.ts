import {
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  IsArray,
  ValidateNested,
  IsEnum,
  IsInt,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export enum MotivacaoTrabalhoNovamente {
  DISCORDO_TOTALMENTE = "DISCORDO_TOTALMENTE",
  DISCORDO_PARCIALMENTE = "DISCORDO_PARCIALMENTE",
  INDIFERENTE = "INDIFERENTE",
  CONCORDO_PARCIALMENTE = "CONCORDO_PARCIALMENTE",
  CONCORDO_TOTALMENTE = "CONCORDO_TOTALMENTE",
}

export class CreateAvaliacaoDto {
  @Transform(({ value }) => Number(value)) // Convert string to number
  @IsNumber()
  @IsPositive()
  idAvaliador: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idAvaliado: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idCiclo: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  nota?: number;

  @IsString()
  justificativa: string;

  @Transform(({ value }) => value !== undefined ? Number(value) : null)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  criterioId?: number;
}

export class CreateAvaliacao360Dto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idAvaliador: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idAvaliado: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idCiclo: number;

  @Transform(({ value }) => (value ? Number(value) : undefined)) // Handle optional number
  @IsOptional()
  @IsNumber()
  nota?: number;

  @IsString()
  pontosFortes: string;

  @IsString()
  pontosMelhora: string;

  @IsString()
  nomeProjeto: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @IsInt()
  periodoMeses: number;

  @IsEnum(MotivacaoTrabalhoNovamente)
  trabalhariaNovamente: MotivacaoTrabalhoNovamente;
}

export class BulkCreateAvaliacaoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvaliacaoDto)
  @IsOptional()
  avaliacoes?: CreateAvaliacaoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvaliacao360Dto)
  @IsOptional()
  avaliacoes360?: CreateAvaliacao360Dto[];
}
