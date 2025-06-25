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
    description: "Nota numérica da avaliação (opcional)",
    example: 8.5,
    type: Number,
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
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
    description: "ID do critério de avaliação específico (opcional)",
    example: 1,
    type: Number,
    required: false,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : null))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  criterioId?: number;
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
    example: 9.0,
    type: Number,
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : undefined)) // Handle optional number
  @IsOptional()
  @IsNumber()
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

export class BulkCreateAvaliacaoDto {
  @ApiProperty({
    description: "Array de avaliações tradicionais para criação em lote",
    type: [CreateAvaliacaoDto],
    required: false,
    example: [
      {
        idAvaliador: 1,
        idAvaliado: 2,
        idCiclo: 1,
        nota: 8.5,
        justificativa: "Excelente desempenho técnico e liderança.",
        criterioId: 1,
      },
    ],
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
    example: [
      {
        idAvaliador: 1,
        idAvaliado: 2,
        idCiclo: 1,
        nota: 9.0,
        pontosFortes: "Excelente comunicação e liderança",
        pontosMelhora: "Melhorar gestão de tempo",
        nomeProjeto: "Sistema de Vendas v2.0",
        periodoMeses: 6,
        trabalhariaNovamente: "CONCORDO_TOTALMENTE",
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvaliacao360Dto)
  @IsOptional()
  avaliacoes360?: CreateAvaliacao360Dto[];
}
