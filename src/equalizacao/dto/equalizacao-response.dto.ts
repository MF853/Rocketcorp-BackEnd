import { ApiProperty } from "@nestjs/swagger";

export class EqualizacaoResponseDto {
  @ApiProperty({
    description: "ID único da equalização",
    example: "eq_123456789",
  })
  idEqualizacao: string;

  @ApiProperty({
    description: "ID do avaliador",
    example: "1",
  })
  idAvaliador: string;

  @ApiProperty({
    description: "ID do avaliado",
    example: "5",
  })
  idAvaliado: string;

  @ApiProperty({
    description: "ID do ciclo de equalização",
    example: "1",
  })
  idCiclo: string;

  @ApiProperty({
    description: "Nome do usuário avaliado",
    example: "Luan Bezerra",
  })
  nomeAvaliado: string;

  @ApiProperty({
    description: "Cargo do usuário avaliado",
    example: "Desenvolvedor Pleno",
    // TODO: Add cargo field to User model in schema.prisma
    // Currently returns a default value
  })
  cargoAvaliado: string;

  @ApiProperty({
    description: "Média das notas de autoavaliação do usuário",
    example: 4.2,
    nullable: true,
  })
  notaAutoavaliacao: number | null;

  @ApiProperty({
    description: "Média das notas do gestor para o usuário",
    example: 4.5,
    nullable: true,
  })
  notaGestor: number | null;

  @ApiProperty({
    description: "Média das notas de avaliação 360 para o usuário",
    example: 4.0,
    nullable: true,
  })
  notaAvaliacao360: number | null;

  @ApiProperty({
    description: "Nota final da equalização",
    example: 4.25,
  })
  notaFinal: number | null;

  @ApiProperty({
    description: "Justificativa para a nota final",
    example: "O colaborador demonstrou excelente desempenho...",
  })
  justificativa: string | null;

  @ApiProperty({
    description: "Resumo gerado pela IA sobre o desempenho do usuário",
    example: "Luan Bezerra é um profissional proativo...",
    nullable: true,
  })
  resumoIA: string | null;

  @ApiProperty({
    description: "Status atual da equalização",
    enum: ["Pendente", "Finalizado"],
    example: "Pendente",
  })
  status: "Pendente" | "Finalizado";
}
