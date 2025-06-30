import { Controller, Post, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { ResumoiaService } from "./resumoia.service";

@ApiTags("Resumos IA")
@Controller("resumoia")
export class ResumoiaController {
  constructor(private readonly resumoiaService: ResumoiaService) {}

  @ApiOperation({
    summary: "Gerar resumos IA para um ciclo",
    description:
      "Processa e gera resumos utilizando IA para todos os usuários que possuem avaliações em um ciclo específico",
  })
  @ApiParam({
    name: "idCiclo",
    description: "ID do ciclo de avaliação",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Resumos gerados com sucesso",
    schema: {
      example: {
        message: "Resumos IA gerados com sucesso para o ciclo 1",
        cicloId: 1,
        processedUsers: 15,
        timestamp: "2025-06-29T10:30:00Z",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Ciclo inválido ou sem avaliações suficientes",
  })
  @ApiResponse({
    status: 500,
    description: "Erro interno do servidor ao processar resumos",
  })
  @Post("processar/ciclo/:idCiclo")
  async processarResumosCiclo(@Param("idCiclo") idCiclo: string) {
    const cicloId = +idCiclo;

    await this.resumoiaService.gerarResumosParaCiclo(cicloId);

    return {
      message: `Resumos IA gerados com sucesso para o ciclo ${cicloId}`,
      cicloId,
      timestamp: new Date().toISOString(),
    };
  }
}
