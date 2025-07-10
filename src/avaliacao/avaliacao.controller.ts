import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AvaliacaoService } from "./avaliacao.service";
import {
  CreateAvaliacaoDto,
  CreateAvaliacao360Dto,
  BulkCreateAvaliacaoDto,
} from "./dto/create-avaliacao.dto";
import {
  UpdateAvaliacaoDto,
  UpdateAvaliacao360Dto,
} from "./dto/update-avaliacao.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  // ApiOkResponse,
  ApiNotFoundResponse,
  // ApiConflictResponse,
  // ApiExtraModels,
  // getSchemaPath,
} from "@nestjs/swagger";

@ApiTags("Avaliacao")
@Controller("avaliacao")
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  // ==================== 360 EVALUATION ENDPOINTS ====================

  @Post("360")
  @ApiOperation({ summary: "Cria uma nova avaliação 360" })
  @ApiResponse({
    status: 201,
    description: "Avaliação 360 criada com sucesso.",
  })
  create360(@Body() createAvaliacao360Dto: CreateAvaliacao360Dto) {
    return this.avaliacaoService.create360(createAvaliacao360Dto);
  }

  @Get("360")
  @ApiOperation({ summary: "Lista todas as avaliações 360" })
  @ApiResponse({
    status: 200,
    description: "Lista de avaliações 360 retornada com sucesso.",
  })
  findAll360() {
    return this.avaliacaoService.findAll360();
  }

  @Get("360/:id")
  @ApiOperation({ summary: "Busca uma avaliação 360 pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Avaliação 360 retornada com sucesso.",
  })
  findOne360(@Param("id") id: string) {
    return this.avaliacaoService.findOne360(+id);
  }

  @Get("360/avaliador/:id")
  @ApiOperation({ summary: "Busca uma avaliação 360 pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Avaliação 360 retornada com sucesso.",
  })
  find360ByAvaliadorId(@Param("id") id: string) {
    return this.avaliacaoService.findOne360(+id);
  }

  @Get("360/avaliado/:id")
  @ApiOperation({ summary: "Busca uma avaliação 360 pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Avaliação 360 retornada com sucesso.",
  })
  find360ByAvaliadoId(@Param("id") id: string) {
    return this.avaliacaoService.findOne360(+id);
  }

  @Patch("360/:id")
  @ApiOperation({ summary: "Atualiza uma avaliação 360 pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Avaliação 360 atualizada com sucesso.",
  })
  update360(
    @Param("id") id: string,
    @Body() updateAvaliacao360Dto: UpdateAvaliacao360Dto
  ) {
    return this.avaliacaoService.update360(+id, updateAvaliacao360Dto);
  }

  @Delete("360/:id")
  @ApiOperation({ summary: "Remove uma avaliação 360 pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Avaliação 360 removida com sucesso.",
  })
  remove360(@Param("id") id: string) {
    return this.avaliacaoService.remove360(+id);
  }

  @Post()
  @ApiOperation({ summary: "Cria uma nova avaliação" })
  @ApiResponse({ status: 201, description: "Avaliação criada com sucesso." })
  create(@Body() createAvaliacaoDto: CreateAvaliacaoDto) {
    return this.avaliacaoService.create(createAvaliacaoDto);
  }

  @Post("bulk")
  @ApiOperation({ summary: "Cria múltiplas avaliações em lote" })
  @ApiResponse({
    status: 201,
    description: "Avaliações criadas com sucesso.",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        created: {
          type: "object",
          properties: {
            avaliacoes: { type: "number" },
            avaliacoes360: { type: "number" },
          },
        },
        data: {
          type: "object",
          properties: {
            avaliacoes: { type: "array" },
            avaliacoes360: { type: "array" },
          },
        },
        errors: { type: "array", items: { type: "string" } },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Erro de conflito - avaliações duplicadas.",
  })
  createBulk(@Body() bulkCreateDto: BulkCreateAvaliacaoDto) {
    console.log("Received Bulk DTO:", JSON.stringify(bulkCreateDto, null, 2));
    console.log("Avaliacoes array:", bulkCreateDto.avaliacoes);
    console.log("Avaliacoes360 array:", bulkCreateDto.avaliacoes360);

    if (bulkCreateDto.avaliacoes?.length) {
      console.log("First avaliacao types:", {
        idAvaliador: typeof bulkCreateDto.avaliacoes[0].idAvaliador,
        idAvaliado: typeof bulkCreateDto.avaliacoes[0].idAvaliado,
        idCiclo: typeof bulkCreateDto.avaliacoes[0].idCiclo,
        nota: typeof bulkCreateDto.avaliacoes[0].nota,
        criterioId: typeof bulkCreateDto.avaliacoes[0].criterioId,
      });
    }

    if (bulkCreateDto.avaliacoes360?.length) {
      console.log("First avaliacao360 types:", {
        idAvaliador: typeof bulkCreateDto.avaliacoes360[0].idAvaliador,
        idAvaliado: typeof bulkCreateDto.avaliacoes360[0].idAvaliado,
        idCiclo: typeof bulkCreateDto.avaliacoes360[0].idCiclo,
        nota: typeof bulkCreateDto.avaliacoes360[0].nota,
      });
    }

    return this.avaliacaoService.createBulk(bulkCreateDto);
  }

  @Post("test")
  @ApiOperation({ summary: "Testa criação de avaliação simples" })
  testCreate(@Body() createDto: CreateAvaliacaoDto) {
    console.log("Received DTO:", createDto);
    console.log("DTO types:", {
      idAvaliador: typeof createDto.idAvaliador,
      idAvaliado: typeof createDto.idAvaliado,
      idCiclo: typeof createDto.idCiclo,
      nota: typeof createDto.nota,
      criterioId: typeof createDto.criterioId,
      justificativa: typeof createDto.justificativa,
    });
    return { message: "Test successful", data: createDto };
  }

  @Get()
  @ApiOperation({ summary: "Lista todas as avaliações" })
  @ApiResponse({
    status: 200,
    description: "Lista de avaliações retornada com sucesso.",
  })
  findAll() {
    return this.avaliacaoService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Busca uma avaliação pelo ID" })
  @ApiResponse({ status: 200, description: "Avaliação retornada com sucesso." })
  findOne(@Param("id") id: string) {
    return this.avaliacaoService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza uma avaliação pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Avaliação atualizada com sucesso.",
  })
  update(
    @Param("id") id: string,
    @Body() updateAvaliacaoDto: UpdateAvaliacaoDto
  ) {
    return this.avaliacaoService.update(+id, updateAvaliacaoDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove uma avaliação pelo ID" })
  @ApiResponse({ status: 200, description: "Avaliação removida com sucesso." })
  remove(@Param("id") id: string) {
    return this.avaliacaoService.remove(+id);
  }

  // ==================== QUERY ENDPOINTS ====================

  @Get("avaliador/:id")
  @ApiOperation({ summary: "Lista avaliações por avaliador" })
  @ApiResponse({
    status: 200,
    description: "Avaliações do avaliador retornadas com sucesso.",
  })
  findByAvaliador(@Param("id") id: string) {
    return this.avaliacaoService.findByAvaliador(+id);
  }

  @Get("avaliado/:id")
  @ApiOperation({ summary: "Lista avaliações por avaliado" })
  @ApiResponse({
    status: 200,
    description: "Avaliações do avaliado retornadas com sucesso.",
  })
  findByAvaliado(@Param("id") id: string) {
    return this.avaliacaoService.findByAvaliado(+id);
  }

  @Get("ciclo/:id")
  @ApiOperation({ summary: "Lista avaliações por ciclo" })
  @ApiResponse({
    status: 200,
    description: "Avaliações do ciclo retornadas com sucesso.",
  })
  findByCiclo(@Param("id") id: string) {
    return this.avaliacaoService.findByCiclo(+id);
  }

  // ==================== ANALYTICS ENDPOINTS ====================
  // MAYBE IGNORE THIS SECTION IF NOT NEEDED
  // --- IGNORE ---
  @Get("analytics/ciclo/:id")
  @ApiOperation({
    summary: "Estatísticas agregadas de avaliações de um ciclo",
    description:
      "Retorna o total de avaliações, avaliações 360, média das notas e média das notas 360 para o ciclo especificado.",
  })
  @ApiResponse({
    status: 200,
    description: "Estatísticas do ciclo retornadas com sucesso.",
    schema: {
      example: {
        totalAvaliacoes: 24,
        totalAvaliacoes360: 10,
        avgNota: 4.2,
        avgNota360: 4.5,
      },
      properties: {
        totalAvaliacoes: { type: "number", example: 24 },
        totalAvaliacoes360: { type: "number", example: 10 },
        avgNota: {
          type: "number",
          example: 4.2,
          description: "Média das notas das avaliações regulares",
        },
        avgNota360: {
          type: "number",
          example: 4.5,
          description: "Média das notas das avaliações 360",
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: "Ciclo não encontrado." })
  getCycleStatistics(@Param("id") id: string) {
    return this.avaliacaoService.getCycleStatistics(+id);
  }

  @Get("analytics/user/:userId")
  @ApiOperation({
    summary: "Resumo de performance do usuário",
    description:
      "Retorna todas as avaliações recebidas e avaliações 360 recebidas pelo usuário, além dos totais.",
  })
  @ApiResponse({
    status: 200,
    description: "Resumo de performance retornado com sucesso.",
    schema: {
      example: {
        avaliacoesRecebidas: [
          {
            id: 1,
            nota: 4.5,
            justificativa: "Ótimo trabalho em equipe.",
            avaliador: { id: 2, name: "Maria" },
            criterio: { id: 3, name: "Trabalho em Equipe" },
          },
        ],
        avaliacoes360Recebidas: [
          {
            id: 1,
            nota: 4.7,
            pontosFortes: "Comunicação clara",
            pontosMelhora: "Mais proatividade",
            avaliador: { id: 4, name: "Pedro" },
          },
        ],
        totalAvaliacoes: 5,
        totalAvaliacoes360: 2,
      },
    },
  })
  @ApiNotFoundResponse({ description: "Usuário não encontrado." })
  getUserPerformanceSummary(@Param("userId") userId: string) {
    return this.avaliacaoService.getUserPerformanceSummary(+userId);
  }

  @Get("analytics/user/:userId/ciclo/:cicloId")
  @ApiOperation({
    summary: "Resumo de performance do usuário por ciclo",
    description:
      "Retorna todas as avaliações recebidas e avaliações 360 recebidas pelo usuário em um ciclo específico, além dos totais.",
  })
  @ApiResponse({
    status: 200,
    description: "Resumo de performance por ciclo retornado com sucesso.",
    schema: {
      example: {
        avaliacoesRecebidas: [
          {
            id: 2,
            nota: 4.0,
            justificativa: "Precisa melhorar em prazos.",
            avaliador: { id: 5, name: "Arthur" },
            criterio: { id: 1, name: "Produtividade" },
          },
        ],
        avaliacoes360Recebidas: [
          {
            id: 3,
            nota: 4.2,
            pontosFortes: "Boa liderança",
            pontosMelhora: "Delegar mais tarefas",
            avaliador: { id: 6, name: "Ana" },
          },
        ],
        totalAvaliacoes: 3,
        totalAvaliacoes360: 1,
      },
    },
  })
  @ApiNotFoundResponse({ description: "Usuário ou ciclo não encontrado." })
  getUserPerformanceSummaryByCiclo(
    @Param("userId") userId: string,
    @Param("cicloId") cicloId: string
  ) {
    return this.avaliacaoService.getUserPerformanceSummary(+userId, +cicloId);
  }
}
