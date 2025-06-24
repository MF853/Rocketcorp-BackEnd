import {
  IsNumber,
  IsString,
  IsPositive,
  IsArray,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class CreateReferenciaDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idReferenciador: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idReferenciado: number;

  @IsString()
  justificativa: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idCiclo: number;
}

export class BulkCreateReferenciaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReferenciaDto)
  @IsOptional()
  referencias?: CreateReferenciaDto[];
}
