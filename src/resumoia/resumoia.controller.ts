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
    description: "Resumos processados com sucesso",
    schema: {
      example: {
        message: "Resumos IA processados para o ciclo 1",
        cicloId: 1,
        statistics: {
          total: 25,
          processed: 23,
          errors: 2,
          batches: 9,
        },
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

    const statistics = await this.resumoiaService.gerarResumosParaCiclo(
      cicloId
    );

    return {
      message: `Resumos IA processados para o ciclo ${cicloId}`,
      cicloId,
      statistics,
      timestamp: new Date().toISOString(),
    };
  }
}
