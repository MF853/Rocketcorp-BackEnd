import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CriterioService } from "./criterio.service";
import {
  CreateCriterioDto,
  BulkCreateCriterioDto,
} from "./dto/create-criterio.dto";
import {
  UpdateCriterioDto,
  BulkUpdateCriterioDto,
} from "./dto/update-criterio.dto";

@ApiTags("Critérios")
@Controller("criterio")
export class CriterioController {
  constructor(private readonly criterioService: CriterioService) {}

  @ApiOperation({
    summary: "Criar novo critério",
    description:
      "Cria um novo critério de avaliação para uma trilha e ciclo específicos",
  })
  @ApiResponse({
    status: 201,
    description: "Critério criado com sucesso",
    schema: {
      example: {
        id: 1,
        name: "Qualidade do Código",
        tipo: "tecnico",
        peso: 25.0,
        description:
          "Avaliação da qualidade, estrutura e boas práticas no desenvolvimento de código",
        idCiclo: 1,
        trilhaId: 1,
        enabled: true,
        createdAt: "2025-06-26T00:00:00Z",
        updatedAt: "2025-06-26T00:00:00Z",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos ou critério já existe nesta trilha",
  })
  @Post()
  create(@Body() createCriterioDto: CreateCriterioDto) {
    return this.criterioService.create(createCriterioDto);
  }

  @ApiOperation({
    summary: "Criar múltiplos critérios",
    description: "Cria múltiplos critérios em uma única operação",
  })
  @ApiResponse({
    status: 201,
    description: "Critérios criados com sucesso",
    schema: {
      example: {
        criterios: [
          {
            id: 1,
            name: "Qualidade do Código",
            tipo: "tecnico",
            peso: 25.0,
            description: "Avaliação da qualidade do código",
            idCiclo: 1,
            trilhaId: 1,
            enabled: true,
          },
        ],
        count: 1,
      },
    },
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @Post("bulk")
  createBulk(@Body() bulkCreateCriterioDto: BulkCreateCriterioDto) {
    return this.criterioService.createBulk(bulkCreateCriterioDto);
  }

  @ApiOperation({
    summary: "Listar todos os critérios",
    description: "Retorna todos os critérios disponíveis no sistema",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de critérios",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Qualidade do Código",
          tipo: "tecnico",
          peso: 25.0,
          description: "Avaliação da qualidade do código",
          idCiclo: 1,
          trilhaId: 1,
          enabled: true,
          createdAt: "2025-06-26T00:00:00Z",
          updatedAt: "2025-06-26T00:00:00Z",
        },
      },
    },
  })
  @Get()
  findAll() {
    return this.criterioService.findAll();
  }

  @ApiOperation({
    summary: "Listar critérios com trilha",
    description:
      "Retorna todos os critérios com informações da trilha associada",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de critérios com trilha",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Qualidade do Código",
          tipo: "tecnico",
          peso: 25.0,
          description: "Avaliação da qualidade do código",
          trilha: {
            id: 1,
            name: "Desenvolvimento Full Stack",
          },
        },
      },
    },
  })
  @Get("with-trilha")
  findAllWithTrilha() {
    return this.criterioService.findAllWithTrilha();
  }

  @ApiOperation({
    summary: "Listar critérios com ciclo",
    description:
      "Retorna todos os critérios com informações do ciclo associado",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de critérios com ciclo",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Qualidade do Código",
          tipo: "tecnico",
          peso: 25.0,
          description: "Avaliação da qualidade do código",
          ciclo: {
            id: 1,
            name: "Q1 2025",
            year: 2025,
            period: 1,
            status: "aberto",
          },
        },
      },
    },
  })
  @Get("with-ciclo")
  findAllWithCiclo() {
    return this.criterioService.findAllWithCiclo();
  }

  @ApiOperation({
    summary: "Listar critérios completos",
    description:
      "Retorna todos os critérios com trilha, ciclo e avaliações associadas",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de critérios completos",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Qualidade do Código",
          tipo: "tecnico",
          peso: 25.0,
          description: "Avaliação da qualidade do código",
          trilha: {
            id: 1,
            name: "Desenvolvimento Full Stack",
          },
          ciclo: {
            id: 1,
            name: "Q1 2025",
            year: 2025,
            period: 1,
            status: "aberto",
          },
          avaliacoes: [
            {
              id: 1,
              nota: 4,
              justificativa: "Excelente qualidade de código",
            },
          ],
        },
      },
    },
  })
  @Get("complete")
  findAllComplete() {
    return this.criterioService.findAllComplete();
  }

  @ApiOperation({
    summary: "Listar critérios habilitados",
    description:
      "Retorna apenas os critérios habilitados para uso nas avaliações",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de critérios habilitados",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Qualidade do Código",
          tipo: "tecnico",
          peso: 25.0,
          description: "Avaliação da qualidade do código",
          enabled: true,
        },
      },
    },
  })
  @Get("enabled")
  findEnabled() {
    return this.criterioService.findEnabled();
  }

  @ApiOperation({
    summary: "Listar critérios por trilha",
    description: "Retorna todos os critérios de uma trilha específica",
  })
  @ApiParam({ name: "trilhaId", description: "ID da trilha", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lista de critérios da trilha",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Qualidade do Código",
          tipo: "tecnico",
          peso: 25.0,
          description: "Avaliação da qualidade do código",
        },
      },
    },
  })
  @Get("trilha/:trilhaId")
  findByTrilhaId(@Param("trilhaId") trilhaId: string) {
    return this.criterioService.findByTrilhaId(+trilhaId);
  }

  @ApiOperation({
    summary: "Listar critérios por ciclo",
    description: "Retorna todos os critérios de um ciclo específico",
  })
  @ApiParam({ name: "cicloId", description: "ID do ciclo", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lista de critérios do ciclo",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Qualidade do Código",
          tipo: "tecnico",
          peso: 25.0,
          description: "Avaliação da qualidade do código",
        },
      },
    },
  })
  @Get("ciclo/:cicloId")
  findByCicloId(@Param("cicloId") cicloId: string) {
    return this.criterioService.findByCicloId(+cicloId);
  }

  @ApiOperation({
    summary: "Listar critérios por trilha e ciclo",
    description: "Retorna critérios específicos de uma trilha em um ciclo",
  })
  @ApiParam({ name: "trilhaId", description: "ID da trilha", example: 1 })
  @ApiParam({ name: "cicloId", description: "ID do ciclo", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lista de critérios da trilha no ciclo",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Qualidade do Código",
          tipo: "tecnico",
          peso: 25.0,
          description: "Avaliação da qualidade do código",
        },
      },
    },
  })
  @Get("trilha/:trilhaId/ciclo/:cicloId")
  findByTrilhaAndCiclo(
    @Param("trilhaId") trilhaId: string,
    @Param("cicloId") cicloId: string
  ) {
    return this.criterioService.findByTrilhaAndCiclo(+trilhaId, +cicloId);
  }

  @ApiOperation({
    summary: "Atualizar múltiplos critérios",
    description: "Atualiza múltiplos critérios em uma única operação",
  })
  @ApiResponse({
    status: 200,
    description: "Critérios atualizados com sucesso",
    schema: {
      example: {
        criterios: [
          {
            id: 1,
            name: "Qualidade do Código Avançada",
            tipo: "tecnico",
            peso: 30.0,
            description: "Avaliação avançada da qualidade do código",
            idCiclo: 1,
            trilhaId: 1,
            enabled: true,
            createdAt: "2025-06-26T00:00:00Z",
            updatedAt: "2025-06-26T01:00:00Z",
          },
        ],
        count: 1,
        updated: [1],
        notFound: [],
      },
    },
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @Patch("bulk")
  updateBulk(@Body() bulkUpdateCriterioDto: BulkUpdateCriterioDto) {
    return this.criterioService.updateBulk(bulkUpdateCriterioDto);
  }

  // === PARAMETERIZED ROUTES - MUST BE AT THE END ===

  @ApiOperation({
    summary: "Buscar critério por ID",
    description: "Retorna um critério específico pelo seu ID",
  })
  @ApiParam({ name: "id", description: "ID do critério", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Critério encontrado",
    schema: {
      example: {
        id: 1,
        name: "Qualidade do Código",
        tipo: "tecnico",
        peso: 25.0,
        description: "Avaliação da qualidade do código",
        idCiclo: 1,
        trilhaId: 1,
        enabled: true,
        createdAt: "2025-06-26T00:00:00Z",
        updatedAt: "2025-06-26T00:00:00Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Critério não encontrado" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.criterioService.findOne(+id);
  }

  @ApiOperation({
    summary: "Buscar critério com trilha por ID",
    description: "Retorna um critério específico com informações da trilha",
  })
  @ApiParam({ name: "id", description: "ID do critério", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Critério com trilha encontrado",
    schema: {
      example: {
        id: 1,
        name: "Qualidade do Código",
        tipo: "tecnico",
        peso: 25.0,
        description: "Avaliação da qualidade do código",
        trilha: {
          id: 1,
          name: "Desenvolvimento Full Stack",
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Critério não encontrado" })
  @Get(":id/with-trilha")
  findOneWithTrilha(@Param("id") id: string) {
    return this.criterioService.findOneWithTrilha(+id);
  }

  @ApiOperation({
    summary: "Buscar critério com ciclo por ID",
    description: "Retorna um critério específico com informações do ciclo",
  })
  @ApiParam({ name: "id", description: "ID do critério", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Critério com ciclo encontrado",
    schema: {
      example: {
        id: 1,
        name: "Qualidade do Código",
        tipo: "tecnico",
        peso: 25.0,
        description: "Avaliação da qualidade do código",
        ciclo: {
          id: 1,
          name: "Q1 2025",
          year: 2025,
          period: 1,
          status: "aberto",
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Critério não encontrado" })
  @Get(":id/with-ciclo")
  findOneWithCiclo(@Param("id") id: string) {
    return this.criterioService.findOneWithCiclo(+id);
  }

  @ApiOperation({
    summary: "Buscar critério completo por ID",
    description:
      "Retorna um critério específico com trilha, ciclo e avaliações",
  })
  @ApiParam({ name: "id", description: "ID do critério", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Critério completo encontrado",
    schema: {
      example: {
        id: 1,
        name: "Qualidade do Código",
        tipo: "tecnico",
        peso: 25.0,
        description: "Avaliação da qualidade do código",
        trilha: {
          id: 1,
          name: "Desenvolvimento Full Stack",
        },
        ciclo: {
          id: 1,
          name: "Q1 2025",
          year: 2025,
          period: 1,
          status: "aberto",
        },
        avaliacoes: [
          {
            id: 1,
            nota: 4,
            justificativa: "Excelente qualidade de código",
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: "Critério não encontrado" })
  @Get(":id/complete")
  findOneComplete(@Param("id") id: string) {
    return this.criterioService.findOneComplete(+id);
  }

  @ApiOperation({
    summary: "Atualizar critério",
    description: "Atualiza um critério existente",
  })
  @ApiParam({ name: "id", description: "ID do critério", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Critério atualizado com sucesso",
    schema: {
      example: {
        id: 1,
        name: "Qualidade do Código Avançada",
        tipo: "tecnico",
        peso: 30.0,
        description: "Avaliação avançada da qualidade do código",
        idCiclo: 1,
        trilhaId: 1,
        enabled: true,
        createdAt: "2025-06-26T00:00:00Z",
        updatedAt: "2025-06-26T01:00:00Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Critério não encontrado" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCriterioDto: UpdateCriterioDto
  ) {
    return this.criterioService.update(+id, updateCriterioDto);
  }

  @ApiOperation({
    summary: "Excluir critério",
    description: "Remove um critério do sistema",
  })
  @ApiParam({ name: "id", description: "ID do critério", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Critério excluído com sucesso",
    schema: {
      example: { id: 1 },
    },
  })
  @ApiResponse({ status: 404, description: "Critério não encontrado" })
  @ApiResponse({
    status: 400,
    description: "Não é possível excluir critério com avaliações vinculadas",
  })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.criterioService.remove(+id);
  }
}
