import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { AvaliacaoService } from "./avaliacao.service";
import {
  CreateAvaliacaoDto,
  CreateAvaliacao360Dto,
  CreateMentoringDto,
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
import { JwtGuard, RolesGuard } from "../auth/guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

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
  @ApiOperation({ summary: "Lista avaliações 360 por avaliador" })
  @ApiResponse({
    status: 200,
    description: "Avaliações 360 do avaliador retornadas com sucesso.",
  })
  find360ByAvaliadorId(@Param("id") id: string) {
    return this.avaliacaoService.findAvaliacoes360ByAvaliador(+id);
  }

  @Get("360/avaliado/:id")
  @ApiOperation({ summary: "Lista avaliações 360 por avaliado" })
  @ApiResponse({
    status: 200,
    description: "Avaliações 360 do avaliado retornadas com sucesso.",
  })
  find360ByAvaliadoId(@Param("id") id: string) {
    return this.avaliacaoService.findAvaliacoes360ByAvaliado(+id);
  }

  @Get("360/ciclo/:id")
  @ApiOperation({ summary: "Lista avaliações 360 por ciclo" })
  @ApiResponse({
    status: 200,
    description: "Avaliações 360 do ciclo retornadas com sucesso.",
  })
  find360ByCicloId(@Param("id") id: string) {
    return this.avaliacaoService.findAvaliacoes360ByCiclo(+id);
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

  // ==================== MENTORING ENDPOINTS ====================

  @Post("mentoring")
  @ApiOperation({ summary: "Cria uma nova avaliação de mentoring" })
  @ApiResponse({
    status: 201,
    description: "Avaliação de mentoring criada com sucesso.",
  })
  createMentoring(@Body() createMentoringDto: CreateMentoringDto) {
    return this.avaliacaoService.createMentoring(createMentoringDto);
  }

  @Get("mentoring")
  @ApiOperation({ summary: "Lista todas as avaliações de mentoring" })
  @ApiResponse({
    status: 200,
    description: "Lista de avaliações de mentoring retornada com sucesso.",
  })
  findAllMentoring() {
    return this.avaliacaoService.findAllMentoring();
  }

  @Get("mentoring/:id")
  @ApiOperation({ summary: "Busca uma avaliação de mentoring pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Avaliação de mentoring retornada com sucesso.",
  })
  findOneMentoring(@Param("id") id: string) {
    return this.avaliacaoService.findOneMentoring(+id);
  }

  @Get("mentoring/mentor/:id")
  @ApiOperation({ summary: "Lista avaliações de mentoring por mentor" })
  @ApiResponse({
    status: 200,
    description: "Avaliações de mentoring do mentor retornadas com sucesso.",
  })
  findMentoringByMentor(@Param("id") id: string) {
    return this.avaliacaoService.findMentoringByMentor(+id);
  }

  @Get("mentoring/mentorado/:id")
  @ApiOperation({ summary: "Lista avaliações de mentoring por mentorado" })
  @ApiResponse({
    status: 200,
    description: "Avaliações de mentoring do mentorado retornadas com sucesso.",
  })
  findMentoringByMentorado(@Param("id") id: string) {
    return this.avaliacaoService.findMentoringByMentorado(+id);
  }

  @Get("mentoring/ciclo/:id")
  @ApiOperation({ summary: "Lista avaliações de mentoring por ciclo" })
  @ApiResponse({
    status: 200,
    description: "Avaliações de mentoring do ciclo retornadas com sucesso.",
  })
  findMentoringByCiclo(@Param("id") id: string) {
    return this.avaliacaoService.findMentoringByCiclo(+id);
  }

  @Patch("mentoring/:id")
  @ApiOperation({ summary: "Atualiza uma avaliação de mentoring pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Avaliação de mentoring atualizada com sucesso.",
  })
  updateMentoring(
    @Param("id") id: string,
    @Body() updateMentoringDto: UpdateAvaliacaoDto
  ) {
    return this.avaliacaoService.updateMentoring(+id, updateMentoringDto);
  }

  @Delete("mentoring/:id")
  @ApiOperation({ summary: "Remove uma avaliação de mentoring pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Avaliação de mentoring removida com sucesso.",
  })
  removeMentoring(@Param("id") id: string) {
    return this.avaliacaoService.removeMentoring(+id);
  }

  // ==================== AUTOAVALIAÇÃO ENDPOINTS ====================

  @Post()
  @ApiOperation({ summary: "Cria uma nova autoavaliação" })
  @ApiResponse({
    status: 201,
    description: "Autoavaliação criada com sucesso.",
  })
  create(@Body() createAvaliacaoDto: CreateAvaliacaoDto) {
    return this.avaliacaoService.create(createAvaliacaoDto);
  }

  @Post("bulk")
  @ApiOperation({
    summary:
      "Cria múltiplas autoavaliações, avaliações 360 e mentoring em lote",
  })
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
            autoavaliacoes: { type: "number" },
            avaliacoes360: { type: "number" },
            mentoring: { type: "number" },
          },
        },
        data: {
          type: "object",
          properties: {
            autoavaliacoes: { type: "array" },
            avaliacoes360: { type: "array" },
            mentoring: { type: "array" },
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
    console.log("Received bulk data:", JSON.stringify(bulkCreateDto, null, 2));
    console.log("Autoavaliacoes array:", bulkCreateDto.autoavaliacoes); // ✅ CORRIGIDO

    if (bulkCreateDto.autoavaliacoes?.length) {
      console.log("First avaliacao types:", {
        idAvaliador: typeof bulkCreateDto.autoavaliacoes[0].idUser,
        idCiclo: typeof bulkCreateDto.autoavaliacoes[0].idCiclo,
        nota: typeof bulkCreateDto.autoavaliacoes[0].nota,
        criterioId: typeof bulkCreateDto.autoavaliacoes[0].criterioId,
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

    if (bulkCreateDto.mentoring?.length) {
      console.log("First mentoring types:", {
        idAvaliador: typeof bulkCreateDto.mentoring[0].idMentorado,
        idAvaliado: typeof bulkCreateDto.mentoring[0].idMentor,
        idCiclo: typeof bulkCreateDto.mentoring[0].idCiclo,
        nota: typeof bulkCreateDto.mentoring[0].nota,
      });
    }

    return this.avaliacaoService.createBulk(bulkCreateDto);
  }

  @Post("test")
  @ApiOperation({ summary: "Testa criação de autoavaliação simples" })
  testCreate(@Body() createDto: CreateAvaliacaoDto) {
    console.log("Received DTO:", createDto);
    console.log("DTO types:", {
      idUser: typeof createDto.idUser,
      idCiclo: typeof createDto.idCiclo,
      nota: typeof createDto.nota,
      criterioId: typeof createDto.criterioId,
      justificativa: typeof createDto.justificativa,
    });
    return { message: "Test successful", data: createDto };
  }

  @Get()
  @ApiOperation({ summary: "Lista todas as autoavaliações" })
  @ApiResponse({
    status: 200,
    description: "Lista de autoavaliações retornada com sucesso.",
  })
  findAll() {
    return this.avaliacaoService.findAll();
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza uma autoavaliação pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Autoavaliação atualizada com sucesso.",
  })
  update(
    @Param("id") id: string,
    @Body() updateAvaliacaoDto: UpdateAvaliacaoDto
  ) {
    return this.avaliacaoService.update(+id, updateAvaliacaoDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove uma autoavaliação pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Autoavaliação removida com sucesso.",
  })
  remove(@Param("id") id: string) {
    return this.avaliacaoService.remove(+id);
  }

  // ==================== AUTOAVALIAÇÃO QUERY ENDPOINTS ====================

  @Get("user/:id")
  @ApiOperation({ summary: "Lista autoavaliações por user" })
  @ApiResponse({
    status: 200,
    description: "Autoavaliações do usuário retornadas com sucesso.",
  })
  findByUser(@Param("id") id: string) {
    return this.avaliacaoService.findByUser(+id);
  }

  @Get("ciclo/:id")
  @ApiOperation({ summary: "Lista autoavaliações por ciclo" })
  @ApiResponse({
    status: 200,
    description: "Autoavaliações do ciclo retornadas com sucesso.",
  })
  findByCiclo(@Param("id") id: string) {
    return this.avaliacaoService.findByCiclo(+id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Busca uma autoavaliação pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Autoavaliação retornada com sucesso.",
  })
  findOne(@Param("id") id: string) {
    return this.avaliacaoService.findOne(+id);
  }

  @Roles("gestor")
  @UseGuards(JwtGuard, RolesGuard)
  @Get("gestor/:gestorId/ciclo/:id")
  @ApiOperation({
    summary:
      "Lista avaliações agrupadas por usuário para o ciclo (gestor view)",
  })
  @ApiResponse({
    status: 200,
    description: "Lista agrupada por usuário retornada com sucesso.",
  })
  async getGestorCiclo(
    @Param("gestorId") gestorId: string,
    @Param("id") id: string
  ) {
    return this.avaliacaoService.getGestorCiclo(+gestorId, +id);
  }

  @Get("gestor/colaborador/:colaboradorId/ciclo/:cicloId")
  @ApiOperation({
    summary: "Lista avaliações de um colaborador específico no ciclo",
  })
  @ApiResponse({
    status: 200,
    description: "Avaliações do colaborador no ciclo retornadas com sucesso.",
  })
  async getColaboradorCiclo(
    @Param("colaboradorId") colaboradorId: string,
    @Param("cicloId") cicloId: string
  ) {
    return this.avaliacaoService.getColaboradorCiclo(+colaboradorId, +cicloId);
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

  @Patch("gestor/bulk")
  @Roles(Role.gestor)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary:
      "Atualiza em lote avaliações de um colaborador em um ciclo (notaGestor/justificativaGestor)",
  })
  @ApiResponse({
    status: 200,
    description: "Avaliações do gestor atualizadas com sucesso.",
    schema: {
      example: {
        updated: 3,
        errors: [],
      },
      properties: {
        updated: { type: "number", example: 3 },
        errors: { type: "array", items: { type: "string" } },
      },
    },
  })
  async patchGestorBulk(
    @Body()
    body: {
      colaboradorId: number;
      cicloId: number;
      updates: {
        avaliacaoId: number;
        notaGestor: number;
        justificativaGestor?: string;
      }[];
    }
  ) {
    return this.avaliacaoService.patchGestorBulk(body);
  }
}
