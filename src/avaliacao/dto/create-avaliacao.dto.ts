import {
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type, Transform } from "class-transformer";

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

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  nota: number;

  @IsString()
  justificativa: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
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
