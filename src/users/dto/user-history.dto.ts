import { ApiProperty } from "@nestjs/swagger";

export class EvaluationScoreDto {
  @ApiProperty({
    description: "Média da autoavaliação",
    example: 4.2,
  })
  autoavaliacao: number;

  @ApiProperty({
    description: "Média de execução",
    example: 4.5,
  })
  execucao: number;

  @ApiProperty({
    description: "Média de postura",
    example: 4.1,
  })
  postura: number;

  @ApiProperty({
    description: "Média de gestão",
    example: 4.3,
    required: false,
  })
  gestao?: number;
}

export class PerformanceDataDto {
  @ApiProperty({
    description: "Semestre/período da avaliação",
    example: "2024.1",
  })
  semester: string;

  @ApiProperty({
    description: "Nota final da equalização",
    example: 4.2,
  })
  score: number;
}

export class EvaluationCycleDto {
  @ApiProperty({
    description: "ID do ciclo",
    example: "1",
  })
  id: string;

  @ApiProperty({
    description: "Nome do ciclo no formato ano.periodo",
    example: "2023.1",
  })
  cycle: string;

  @ApiProperty({
    description: "Status do ciclo de avaliação",
    enum: ["em-andamento", "finalizado"],
    example: "finalizado",
  })
  status: "em-andamento" | "finalizado";

  @ApiProperty({
    description: "Nota final da equalização",
    example: 4.2,
    required: false,
  })
  finalScore?: number;

  @ApiProperty({
    description: "Detalhes das pontuações",
    type: EvaluationScoreDto,
  })
  scores: EvaluationScoreDto;

  @ApiProperty({
    description: "Resumo da IA do ciclo",
    example: "Colaborador demonstrou excelente performance...",
  })
  resumo: string;

  @ApiProperty({
    description: "Período (mesmo valor do cycle)",
    example: "2023.1",
  })
  period: string;

  @ApiProperty({
    description: "Data de finalização do ciclo",
    example: "2023-12-15T10:00:00.000Z",
    required: false,
  })
  completionDate?: string;
}

export class UserHistoryResponseDto {
  @ApiProperty({
    description: "ID do usuário",
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: "Nome do usuário",
    example: "João Silva",
  })
  userName: string;

  @ApiProperty({
    description: "Nota atual (mais recente)",
    example: 4.5,
  })
  currentScore: number;

  @ApiProperty({
    description: "Semestre atual",
    example: "2024.2",
  })
  currentSemester: string;

  @ApiProperty({
    description: "Nota anterior",
    example: 4.2,
  })
  lastScore: number;

  @ApiProperty({
    description: "Semestre anterior",
    example: "2024.1",
  })
  lastSemester: string;

  @ApiProperty({
    description: "Crescimento (diferença entre nota atual e anterior)",
    example: 0.3,
  })
  growth: number;

  @ApiProperty({
    description: "Total de avaliações realizadas",
    example: 5,
  })
  totalEvaluations: number;

  @ApiProperty({
    description: "Dados de performance histórica",
    type: [PerformanceDataDto],
  })
  performanceData: PerformanceDataDto[];

  @ApiProperty({
    description: "Ciclos de avaliação detalhados",
    type: [EvaluationCycleDto],
  })
  evaluationCycles: EvaluationCycleDto[];
}
