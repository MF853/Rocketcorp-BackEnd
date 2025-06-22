import { IsNumber, IsString, IsOptional, IsPositive } from "class-validator";

export class CreateAvaliacaoDto {
  @IsNumber()
  @IsPositive()
  idAvaliador: number;

  @IsNumber()
  @IsPositive()
  idAvaliado: number;

  @IsNumber()
  @IsPositive()
  idCiclo: number;

  @IsPositive()
  @IsNumber()
  nota: number;

  @IsString()
  justificativa: string;

  @IsNumber()
  @IsPositive()
  criterioId: number;
}

export class CreateAvaliacao360Dto {
  @IsNumber()
  @IsPositive()
  idAvaliador: number;

  @IsNumber()
  @IsPositive()
  idAvaliado: number;

  @IsNumber()
  @IsPositive()
  idCiclo: number;

  @IsOptional()
  @IsNumber()
  nota: number;

  @IsString()
  pontosFortes: string;

  @IsString()
  pontosMelhora: string;
}
