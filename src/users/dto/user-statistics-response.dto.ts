import { ApiProperty } from "@nestjs/swagger";

export class UserBasicInfoDto {
  @ApiProperty({ description: "ID do usuário" })
  id: number;

  @ApiProperty({ description: "Nome do usuário" })
  name: string;

  @ApiProperty({ description: "Email do usuário" })
  email: string;
}

export class UserStatisticsResponseDto {
  @ApiProperty({
    description: "Informações básicas do usuário",
    type: UserBasicInfoDto,
  })
  user: UserBasicInfoDto;

  @ApiProperty({
    description: "Média das autoavaliações do usuário",
    nullable: true,
    example: 4.3,
  })
  autoavaliacaoAverage: number | null;

  @ApiProperty({
    description: "Quantidade de autoavaliações realizadas",
    example: 8,
  })
  autoavaliacaoCount: number;

  @ApiProperty({
    description: "Média das avaliações feitas pelo gestor",
    nullable: true,
    example: 4.5,
  })
  avaliacaoGestorAvg: number | null;

  @ApiProperty({
    description: "Quantidade de avaliações feitas pelo gestor",
    example: 5,
  })
  avaliacaoGestorCount: number;

  @ApiProperty({
    description: "Média das avaliações 360°",
    nullable: true,
    example: 4.1,
  })
  avaliacao360Avg: number | null;

  @ApiProperty({
    description: "Quantidade de avaliações 360° recebidas",
    example: 12,
  })
  avaliacao360Count: number;

  @ApiProperty({
    description: "ID do ciclo utilizado no filtro (se especificado)",
    nullable: true,
    example: 1,
  })
  cicloId: number | null;
}
