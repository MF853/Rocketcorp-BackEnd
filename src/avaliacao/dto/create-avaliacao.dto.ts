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
  IsNotEmpty,
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

// ✅ RENOMEADO: CreateAvaliacaoDto -> CreateAutoavaliacaoDto
export class CreateAutoavaliacaoDto {
  @ApiProperty({
    description: "ID do usuário que está realizando a autoavaliação",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idAvaliador: number;

  @ApiProperty({
    description: "ID do usuário que está sendo avaliado (mesmo que idAvaliador para autoavaliação)",
    example: 1,
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
    description: "Nota numérica da autoavaliação de 1 a 5",
    example: 4,
    type: Number,
    minimum: 1,
    maximum: 5,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1, { message: "Nota deve ser no mínimo 1" })
  @Max(5, { message: "Nota deve ser no máximo 5" })
  nota: number;

  @ApiProperty({
    description: "Justificativa detalhada da autoavaliação",
    example: "Demonstrei excelente desempenho técnico neste critério.",
    type: String,
  })
  @IsString()
  justificativa: string;

  @ApiProperty({
    description: "ID do critério de avaliação específico (obrigatório para autoavaliação)",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  criterioId: number;

  @ApiProperty({
    description: "Nota do gestor de 1 a 5 (opcional)",
    example: 4,
    type: Number,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @Transform(({ value }) => value ? Number(value) : undefined)
  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Nota do gestor deve ser no mínimo 1" })
  @Max(5, { message: "Nota do gestor deve ser no máximo 5" })
  notaGestor?: number;

  @ApiProperty({
    description: "Justificativa da nota do gestor (opcional)",
    example: "Concordo com a autoavaliação apresentada.",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  justificativaGestor?: string;
}

// ✅ Manter CreateAvaliacao360Dto
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
  @Transform(({ value }) => (value ? Number(value) : undefined))
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

// ✅ Classe CreateMentoringDto
export class CreateMentoringDto {
  @ApiProperty({
    description: "ID do mentor que está sendo avaliado",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idMentor: number;

  @ApiProperty({
    description: "ID do mentorado que está fazendo a avaliação",
    example: 2,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idMentorado: number;

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
    description: "Nota da avaliação do mentor (1 a 5)",
    example: 4.5,
    type: Number,
    minimum: 1,
    maximum: 5,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1, { message: "Nota deve ser no mínimo 1" })
  @Max(5, { message: "Nota deve ser no máximo 5" })
  nota: number;

  @ApiProperty({
    description: "Justificativa da avaliação do mentoring",
    example: "Excelente mentor, sempre disponível e dá feedbacks construtivos.",
    type: String,
  })
  @IsString()
  justificativa: string;

  @ApiProperty({
    description: "Nota do gestor sobre o mentoring (opcional)",
    example: 4.8,
    type: Number,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @Transform(({ value }) => value ? Number(value) : undefined)
  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Nota do gestor deve ser no mínimo 1" })
  @Max(5, { message: "Nota do gestor deve ser no máximo 5" })
  notaGestor?: number;

  @ApiProperty({
    description: "Justificativa da nota do gestor (opcional)",
    example: "Concordo com a avaliação, mentor exemplar.",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  justificativaGestor?: string;
}

// ✅ DTOs de Update
export class UpdateAutoavaliacaoDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  nota?: number;

  @IsOptional()
  @IsString()
  justificativa?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  notaGestor?: number;

  @IsOptional()
  @IsString()
  justificativaGestor?: string;
}

export class UpdateAvaliacao360Dto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  nota?: number;

  @IsOptional()
  @IsString()
  pontosFortes?: string;

  @IsOptional()
  @IsString()
  pontosMelhora?: string;

  @IsOptional()
  @IsString()
  nomeProjeto?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  periodoMeses?: number;

  @IsOptional()
  @IsEnum(MotivacaoTrabalhoNovamente)
  trabalhariaNovamente?: MotivacaoTrabalhoNovamente;
}

export class UpdateMentoringDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  nota?: number;

  @IsOptional()
  @IsString()
  justificativa?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  notaGestor?: number;

  @IsOptional()
  @IsString()
  justificativaGestor?: string;
}

// ✅ Novas classes para referências
export class CreateReferenciaDto {
  @ApiProperty({
    description: "ID do usuário que está referenciando",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idReferenciador: number;

  @ApiProperty({
    description: "ID do usuário que está sendo referenciado",
    example: 2,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idReferenciado: number;

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
    description: "Justificativa da referência",
    example: "Colaborador exemplar, sempre cumprindo prazos e metas.",
    type: String,
  })
  @IsString()
  justificativa: string;
}

// ✅ Bulk DTOs atualizados
export class BulkCreateAvaliacaoDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAutoavaliacaoDto)
  autoavaliacoes?: CreateAutoavaliacaoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAvaliacao360Dto)
  avaliacoes360?: CreateAvaliacao360Dto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMentoringDto)
  mentoring?: CreateMentoringDto[];
}

// ✅ Para compatibilidade com código existente (alias)
export class CreateAvaliacaoDto extends CreateAutoavaliacaoDto {}
