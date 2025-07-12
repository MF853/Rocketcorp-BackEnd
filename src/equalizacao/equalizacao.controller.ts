import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { EqualizacaoService } from "./equalizacao.service";
import { CreateEqualizacaoDto } from "./dto/create-equalizacao.dto";
import { UpdateEqualizacaoDto } from "./dto/update-equalizacao.dto";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("Equalizacao")
@Controller("equalizacao")
export class EqualizacaoController {
  constructor(private readonly equalizacaoService: EqualizacaoService) {}

  @Post()
  create(@Body() createEqualizacaoDto: CreateEqualizacaoDto) {
    return this.equalizacaoService.create(createEqualizacaoDto);
  }

  @Get()
  findAll() {
    return this.equalizacaoService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.equalizacaoService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateEqualizacaoDto: UpdateEqualizacaoDto
  ) {
    return this.equalizacaoService.update(+id, updateEqualizacaoDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.equalizacaoService.remove(+id);
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
}
