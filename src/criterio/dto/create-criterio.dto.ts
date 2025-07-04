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

export class CreateCriterioDto {
  @ApiProperty({
    description: "Nome do critério de avaliação",
    example: "Qualidade do Código",
    type: String,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: "Tipo do critério de avaliação",
    example: "tecnico",
    enum: ["comportamental", "tecnico", "gestao", "negocios"],
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(["comportamental", "tecnico", "gestao", "negocios"], {
    message: "Tipo deve ser: comportamental, tecnico, gestao ou negocios",
  })
  tipo: string;

  @ApiProperty({
    description: "Peso do critério na avaliação (1.0 a 100.0)",
    example: 20.0,
    type: Number,
    minimum: 1.0,
    maximum: 100.0,
    default: 20.0,
    required: false,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : 20.0))
  @IsOptional()
  @IsNumber()
  @Min(1.0, { message: "Peso deve ser no mínimo 1.0" })
  @Max(100.0, { message: "Peso deve ser no máximo 100.0" })
  peso?: number;

  @ApiProperty({
    description: "Descrição detalhada do critério de avaliação",
    example:
      "Avaliação da qualidade, estrutura e boas práticas no desenvolvimento de código",
    type: String,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({
    description: "ID do ciclo de avaliação ao qual o critério pertence",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idCiclo: number;

  @ApiProperty({
    description: "ID da trilha à qual o critério pertence",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  trilhaId: number;

  @ApiProperty({
    description: "Se o critério está habilitado para uso nas avaliações",
    example: true,
    type: Boolean,
    default: true,
    required: false,
  })
  @Transform(({ value }) => {
    if (value === undefined) return true;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return Boolean(value);
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class BulkCreateCriterioDto {
  @ApiProperty({
    description: "Array de critérios para criação em lote",
    type: [CreateCriterioDto],
    example: [
      {
        name: "Qualidade do Código",
        tipo: "tecnico",
        peso: 25.0,
        description:
          "Avaliação da qualidade, estrutura e boas práticas no desenvolvimento de código",
        idCiclo: 1,
        trilhaId: 1,
        enabled: true,
      },
      {
        name: "Trabalho em Equipe",
        tipo: "comportamental",
        peso: 20.0,
        description:
          "Capacidade de colaborar efetivamente com membros da equipe",
        idCiclo: 1,
        trilhaId: 1,
        enabled: true,
      },
      {
        name: "Gestão de Projetos",
        tipo: "gestao",
        peso: 30.0,
        description:
          "Habilidade para planejar, executar e entregar projetos dentro do prazo",
        idCiclo: 1,
        trilhaId: 2,
        enabled: true,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCriterioDto)
  @IsOptional()
  criterios?: CreateCriterioDto[];
}
