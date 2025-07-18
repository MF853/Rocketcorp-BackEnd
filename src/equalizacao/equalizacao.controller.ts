import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { EqualizacaoService } from "./equalizacao.service";
import { CreateEqualizacaoDto } from "./dto/create-equalizacao.dto";
import { UpdateEqualizacaoDto } from "./dto/update-equalizacao.dto";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { LogService } from '../log/log.service';
import { Request } from 'express';
import { UserPayload } from '../types/express';
import { JwtGuard } from '../auth/guard';

@ApiTags("Equalizacao")
@Controller("equalizacao")
export class EqualizacaoController {
  constructor(
    private readonly equalizacaoService: EqualizacaoService,
    private readonly logService: LogService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: "Create a new equalizacao" })
  @ApiBody({ type: CreateEqualizacaoDto })
  @ApiResponse({ status: 201, description: "Equalizacao created successfully" })
  async create(@Body() createEqualizacaoDto: CreateEqualizacaoDto, @Req() req: Request) {
    const result = await this.equalizacaoService.create(createEqualizacaoDto);
    const userId = (req.user as UserPayload)?.userId;
    await this.logService.createLog({
      userId,
      action: 'CREATE',
      entity: 'Equalizacao',
    });
    return result;
  }

  @Get("ciclo/:cicloId")
  @ApiOperation({
    summary:
      "Busca equalizações de avaliações de todos os usuários em um ciclo",
    description:
      "Retorna dados completos de equalização incluindo médias de autoavaliação, avaliação do gestor, avaliação 360° e resumo IA para todos os usuários que possuem avaliações no ciclo especificado.",
  })
  @ApiParam({
    name: "cicloId",
    description: "ID do ciclo para buscar equalizações",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description:
      "Equalizações de todos os usuários no ciclo retornadas com sucesso.",
    type: [EqualizacaoResponseDto],
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          idEqualizacao: { type: "string", example: "eq_5_1" },
          idAvaliador: { type: "string", example: "5" },
          idAvaliado: { type: "string", example: "5" },
          nomeAvaliado: { type: "string", example: "Luan Bezerra" },
          cargoAvaliado: {
            type: "string",
            example: "Desenvolvedor",
            description: "Cargo do usuário avaliado",
          },
          notaAutoavaliacao: { type: "number", example: 4.2, nullable: true },
          notaGestor: { type: "number", example: 4.5, nullable: true },
          notaAvaliacao360: { type: "number", example: 4.1, nullable: true },
          notaFinal: { type: "number", example: null, nullable: true },
          justificativa: {
            type: "string",
            example: null,
            nullable: true,
            description: "Será preenchida pelo módulo de equalização",
          },
          resumoIA: {
            type: "string",
            example:
              "Luan demonstra excelente capacidade técnica conforme suas autoavaliações em organização e produtividade. Destacado pelas avaliações do gestor por sua qualidade de código. Suas autoavaliações mostram autocrítica saudável sobre trabalho em equipe. Profissional comprometido com grande potencial para crescimento.",
          },
          status: {
            type: "string",
            enum: ["Pendente", "Finalizado"],
            example: "Finalizado",
          },
        },
      },
      example: [
        {
          idEqualizacao: "eq_5_1",
          idAvaliador: "5",
          idAvaliado: "5",
          nomeAvaliado: "Luan Bezerra",
          cargoAvaliado: "Desenvolvedor",
          notaAutoavaliacao: 4.2,
          notaGestor: 4.5,
          notaAvaliacao360: 4.1,
          notaFinal: null,
          justificativa: null,
          resumoIA:
            "Luan demonstra excelente capacidade técnica conforme suas autoavaliações em organização e produtividade. Destacado pelas avaliações do gestor por sua qualidade de código.",
          status: "Finalizado",
        },
        {
          idEqualizacao: "eq_7_1",
          idAvaliador: "7",
          idAvaliado: "7",
          nomeAvaliado: "Maria Santos",
          cargoAvaliado: "Desenvolvedor",
          notaAutoavaliacao: 4.4,
          notaGestor: 4.6,
          notaAvaliacao360: 4.3,
          notaFinal: null,
          justificativa: null,
          resumoIA: "",
          status: "Pendente",
        },
      ],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Lista vazia se nenhum usuário possui avaliações no ciclo.",
    schema: {
      type: "array",
      items: {},
      example: [],
    },
  })
  getEqualizacoesByCycle(
    @Param("cicloId") cicloId: string
  ): Promise<EqualizacaoResponseDto[]> {
    return this.equalizacaoService.getEqualizacoesByCycle(+cicloId);
  }

  @Get("ciclo/:cicloId/avaliado/:idAvaliado")
  @ApiOperation({
    summary: "Busca equalização de um usuário específico em um ciclo",
    description:
      "Retorna a equalização de um usuário (idAvaliado) em um ciclo (cicloId).",
  })
  @ApiParam({
    name: "cicloId",
    description: "ID do ciclo para buscar equalização",
    type: "number",
  })
  @ApiParam({
    name: "idAvaliado",
    description: "ID do usuário avaliado",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "Equalização encontrada com sucesso.",
    type: EqualizacaoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description:
      "Equalização não encontrada para o usuário e ciclo informados.",
  })
  getEqualizacaoByCicloAndAvaliado(
    @Param("cicloId") cicloId: string,
    @Param("idAvaliado") idAvaliado: string
  ): Promise<EqualizacaoResponseDto | null> {
    return this.equalizacaoService.getEqualizacaoByCicloAndAvaliado(
      +cicloId,
      +idAvaliado
    );
  }

  @Get("avaliado/:idAvaliado")
  @ApiOperation({
    summary: "Busca todas as equalizações de um usuário em todos os ciclos",
    description:
      "Retorna todas as equalizações onde o usuário informado é o avaliado.",
  })
  @ApiParam({
    name: "idAvaliado",
    description: "ID do usuário avaliado",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de equalizações encontradas.",
    type: [EqualizacaoResponseDto],
  })
  getEqualizacoesByAvaliado(
    @Param("idAvaliado") idAvaliado: string
  ): Promise<EqualizacaoResponseDto[]> {
    return this.equalizacaoService.getEqualizacoesByAvaliado(+idAvaliado);
  }

  @Get("current-cycle")
  @ApiOperation({
    summary: "Get equalizações for current cycle in revisao comite phase",
    description:
      "Returns equalizações for the cycle that is currently in 'revisao comite' phase based on current date",
  })
  @ApiResponse({
    status: 200,
    description: "Equalizações for current cycle in revisao comite",
    type: [EqualizacaoResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: "No cycle found in 'revisao comite' phase for current date",
  })
  async getCurrentCycleInRevisao(): Promise<EqualizacaoResponseDto[]> {
    return this.equalizacaoService.getEqualizacoesCycleInRevisao();
  }

  @Get()
  findAll() {
    return this.equalizacaoService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.equalizacaoService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch()
  @ApiOperation({ summary: "Update an existing equalizacao" })
  @ApiBody({ type: UpdateEqualizacaoDto })
  @ApiResponse({
    status: 200,
    description: "Equalizacao updated successfully",
    type: EqualizacaoResponseDto,
  })
  @ApiResponse({ status: 400, description: "ID is required in the DTO" })
  @ApiResponse({ status: 404, description: "Equalizacao not found" })
  async update(@Body() updateEqualizacaoDto: UpdateEqualizacaoDto, @Req() req: Request) {
    const result = await this.equalizacaoService.update(updateEqualizacaoDto);
    const userId = (req.user as UserPayload)?.userId;
    await this.logService.createLog({
      userId,
      action: 'UPDATE',
      entity: 'Equalizacao',
    });
    return result;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.equalizacaoService.remove(+id);
  }
}
