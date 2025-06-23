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

@ApiTags("Avaliacao")
@Controller("avaliacao")
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

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

  @Get("analytics/ciclo/:id")
  @ApiOperation({ summary: "Estatísticas de um ciclo" })
  @ApiResponse({
    status: 200,
    description: "Estatísticas do ciclo retornadas com sucesso.",
  })
  getCycleStatistics(@Param("id") id: string) {
    return this.avaliacaoService.getCycleStatistics(+id);
  }

  @Get("analytics/user/:userId")
  @ApiOperation({ summary: "Resumo de performance do usuário" })
  @ApiResponse({
    status: 200,
    description: "Resumo de performance retornado com sucesso.",
  })
  getUserPerformanceSummary(@Param("userId") userId: string) {
    return this.avaliacaoService.getUserPerformanceSummary(+userId);
  }

  @Get("analytics/user/:userId/ciclo/:cicloId")
  @ApiOperation({ summary: "Resumo de performance do usuário por ciclo" })
  @ApiResponse({
    status: 200,
    description: "Resumo de performance por ciclo retornado com sucesso.",
  })
  getUserPerformanceSummaryByCiclo(
    @Param("userId") userId: string,
    @Param("cicloId") cicloId: string
  ) {
    return this.avaliacaoService.getUserPerformanceSummary(+userId, +cicloId);
  }
}
