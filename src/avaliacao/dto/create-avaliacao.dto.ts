import {
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  IsArray,
  ValidateNested,
  IsEnum,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export enum MotivacaoTrabalhoNovamente {
  DISCORDO_TOTALMENTE = "DISCORDO_TOTALMENTE",
  DISCORDO_PARCIALMENTE = "DISCORDO_PARCIALMENTE",
  INDIFERENTE = "INDIFERENTE",
  CONCORDO_PARCIALMENTE = "CONCORDO_PARCIALMENTE",
  CONCORDO_TOTALMENTE = "CONCORDO_TOTALMENTE",
}

export class CreateAvaliacaoDto {
  @ApiProperty({
    description: "ID do usuário que está realizando a avaliação",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value)) // Convert string to number
  @IsNumber()
  @IsPositive()
  idAvaliador: number;

  @ApiProperty({
    description: "ID do usuário que está sendo avaliado",
    example: 2,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idAvaliado: number;

  @ApiProperty({
    description: "ID do ciclo de avaliação",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idCiclo: number;

  @ApiProperty({
    description: "Nota numérica da avaliação de 1 a 5 (opcional)",
    example: 4,
    type: Number,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Nota deve ser no mínimo 1" })
  @Max(5, { message: "Nota deve ser no máximo 5" })
  nota?: number;

  @ApiProperty({
    description:
      "Justificativa detalhada da avaliação, explicando os pontos observados e feedback",
    example:
      "O colaborador demonstrou excelente desempenho técnico e liderança durante o período avaliado. Possui forte capacidade de resolução de problemas e trabalho em equipe.",
    type: String,
  })
  @IsString()
  justificativa: string;

  @ApiProperty({
    description: "ID do critério de avaliação específico",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  criterioId: number; // ✅ Remover opcional e undefined

  // ✅ Adicionar campo notaGestor
  @ApiProperty({
    description: "Nota do gestor de 1 a 5 (opcional)",
    example: 4,
    type: Number,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Nota do gestor deve ser no mínimo 1" })
  @Max(5, { message: "Nota do gestor deve ser no máximo 5" })
  notaGestor?: number;
}

export class CreateAvaliacao360Dto {
  @ApiProperty({
    description: "ID do usuário que está realizando a avaliação 360",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idAvaliador: number;

  @ApiProperty({
    description: "ID do usuário que está sendo avaliado na avaliação 360",
    example: 2,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idAvaliado: number;

  @ApiProperty({
    description: "ID do ciclo de avaliação 360",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idCiclo: number;

  @ApiProperty({
    description: "Nota numérica da avaliação 360 (opcional)",
    example: 4,
    type: Number,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : undefined)) // Handle optional number
  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Nota deve ser no mínimo 1" })
  @Max(5, { message: "Nota deve ser no máximo 5" })
  nota?: number;

  @ApiProperty({
    description: "Descrição dos pontos fortes identificados no colaborador",
    example:
      "Excelente comunicação, liderança natural, capacidade analítica desenvolvida, proatividade em resolver problemas complexos.",
    type: String,
  })
  @IsString()
  pontosFortes: string;

  @ApiProperty({
    description:
      "Descrição dos pontos de melhoria identificados no colaborador",
    example:
      "Poderia desenvolver mais habilidades de apresentação, melhorar gestão de tempo em projetos simultâneos.",
    type: String,
  })
  @IsString()
  pontosMelhora: string;

  @ApiProperty({
    description: "Nome do projeto principal em que trabalharam juntos",
    example: "Sistema de Gestão de Vendas v2.0",
    type: String,
  })
  @IsString()
  nomeProjeto: string;

  @ApiProperty({
    description: "Período em meses que trabalharam juntos no projeto",
    example: 6,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @IsInt()
  periodoMeses: number;

  @ApiProperty({
    description: "Indicação se trabalharia novamente com o colaborador",
    enum: MotivacaoTrabalhoNovamente,
    example: MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
    enumName: "MotivacaoTrabalhoNovamente",
  })
  @IsEnum(MotivacaoTrabalhoNovamente)
  trabalhariaNovamente: MotivacaoTrabalhoNovamente;
}

// ✅ Verificar se esta classe existe e está exportada
export class BulkCreateAvaliacaoDto {
  @ApiProperty({
    description: "Array de avaliações para criação em lote",
    type: [CreateAvaliacaoDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvaliacaoDto)
  @IsOptional()
  avaliacoes?: CreateAvaliacaoDto[];

  @ApiProperty({
    description: "Array de avaliações 360 para criação em lote",
    type: [CreateAvaliacao360Dto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvaliacao360Dto)
  @IsOptional()
  avaliacoes360?: CreateAvaliacao360Dto[];
}
