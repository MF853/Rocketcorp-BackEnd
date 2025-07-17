import { ApiProperty } from "@nestjs/swagger";

export class EvaluationScore {
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

export class EvaluationCycle {
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
    type: EvaluationScore,
  })
  scores: EvaluationScore;

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

export class UserEvaluationCyclesResponseDto {
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
    description: "Lista de ciclos de avaliação",
    type: [EvaluationCycle],
  })
  evaluationCycles: EvaluationCycle[];
}
