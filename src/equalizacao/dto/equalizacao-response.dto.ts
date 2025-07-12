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
    description: "Média das avaliações 360° do usuário",
    example: 4.1,
    nullable: true,
  })
  notaAvaliacao360: number | null;

  @ApiProperty({
    description: "Nota final calculada (ainda não implementada)",
    example: null,
    nullable: true,
  })
  notaFinal: number | null;

  @ApiProperty({
    description:
      "Justificativa principal ou observações (será preenchida pelo módulo de equalização)",
    example: null,
    nullable: true,
  })
  justificativa: string | null;

  @ApiProperty({
    description: "Resumo gerado por IA com base nas avaliações",
    example:
      "Luan demonstra excelente capacidade técnica conforme suas autoavaliações...",
  })
  resumoIA: string;

  @ApiProperty({
    description: "Status atual da equalização",
    enum: ["Pendente", "Finalizado"],
    example: "Pendente",
  })
  status: "Pendente" | "Finalizado";
}
