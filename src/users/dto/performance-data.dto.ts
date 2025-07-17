import { ApiProperty } from "@nestjs/swagger";

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

export class UserPerformanceResponseDto {
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
    description: "Lista de dados de performance por semestre",
    type: [PerformanceDataDto],
  })
  performanceData: PerformanceDataDto[];
}
