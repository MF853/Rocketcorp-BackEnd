import { PartialType } from "@nestjs/swagger";
import { CreateCriterioDto } from "./create-criterio.dto";
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsIn,
  Min,
  Max,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCriterioDto extends PartialType(CreateCriterioDto) {}

export class UpdateCriterioItemDto {
  @ApiProperty({
    description: "ID do critério a ser atualizado",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: "Nome do critério de avaliação",
    example: "Qualidade do Código Avançada",
    type: String,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: "Tipo do critério de avaliação",
    example: "tecnico",
    enum: ["comportamental", "tecnico", "gestao", "negocios"],
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(["comportamental", "tecnico", "gestao", "negocios"], {
    message: "Tipo deve ser: comportamental, tecnico, gestao ou negocios",
  })
  tipo?: string;

  @ApiProperty({
    description: "Peso do critério na avaliação (1.0 a 100.0)",
    example: 25.0,
    type: Number,
    minimum: 1.0,
    maximum: 100.0,
    required: false,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(1.0, { message: "Peso deve ser no mínimo 1.0" })
  @Max(100.0, { message: "Peso deve ser no máximo 100.0" })
  peso?: number;

  @ApiProperty({
    description: "Descrição detalhada do critério de avaliação",
    example:
      "Avaliação da qualidade, estrutura e boas práticas avançadas no desenvolvimento de código",
    type: String,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: "ID do ciclo de avaliação ao qual o critério pertence",
    example: 1,
    type: Number,
    required: false,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  idCiclo?: number;

  @ApiProperty({
    description: "ID da trilha à qual o critério pertence",
    example: 1,
    type: Number,
    required: false,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  trilhaId?: number;

  @ApiProperty({
    description: "Se o critério está habilitado para uso nas avaliações",
    example: false,
    type: Boolean,
    required: false,
  })
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return Boolean(value);
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class BulkUpdateCriterioDto {
  @ApiProperty({
    description: "Array de critérios para atualização em lote",
    type: [UpdateCriterioItemDto],
    example: [
      {
        id: 1,
        name: "Qualidade do Código Avançada",
        peso: 30.0,
        description:
          "Avaliação avançada da qualidade, estrutura e boas práticas no desenvolvimento de código",
        enabled: true,
      },
      {
        id: 2,
        name: "Trabalho em Equipe e Liderança",
        tipo: "comportamental",
        peso: 25.0,
        description:
          "Capacidade de colaborar efetivamente e liderar membros da equipe",
      },
      {
        id: 3,
        enabled: false,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCriterioItemDto)
  @IsOptional()
  criterios?: UpdateCriterioItemDto[];
}
