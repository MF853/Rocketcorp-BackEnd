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
import { TrilhaService } from "./trilha.service";
import { CreateTrilhaDto, BulkCreateTrilhaDto } from "./dto/create-trilha.dto";
import { UpdateTrilhaDto } from "./dto/update-trilha.dto";
import { BulkUpdateTrilhaDto } from "./dto/bulk-update-trilha.dto";

@ApiTags("Trilhas")
@Controller("trilha")
export class TrilhaController {
  constructor(private readonly trilhaService: TrilhaService) {}

  @ApiOperation({
    summary: "Criar nova trilha",
    description: "Cria uma nova trilha de desenvolvimento ou carreira",
  })
  @ApiResponse({
    status: 201,
    description: "Trilha criada com sucesso",
    schema: {
      example: {
        id: 1,
        name: "Desenvolvimento Full Stack",
        createdAt: "2025-06-25T18:30:00Z",
        updatedAt: "2025-06-25T18:30:00Z",
      },
    },
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @Post()
  create(@Body() createTrilhaDto: CreateTrilhaDto) {
    return this.trilhaService.create(createTrilhaDto);
  }

  @ApiOperation({
    summary: "Criar múltiplas trilhas",
    description: "Cria múltiplas trilhas em uma única operação",
  })
  @ApiResponse({
    status: 201,
    description: "Trilhas criadas com sucesso",
    schema: {
      example: {
        trilhas: [
          /* array de trilhas */
        ],
        count: 3,
      },
    },
  })
  @Post("bulk")
  createBulk(@Body() bulkCreateTrilhaDto: BulkCreateTrilhaDto) {
    return this.trilhaService.createBulk(bulkCreateTrilhaDto);
  }

  @ApiOperation({
    summary: "Listar todas as trilhas",
    description: "Retorna todas as trilhas disponíveis no sistema",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de trilhas",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Desenvolvimento Full Stack",
          createdAt: "2025-06-25T18:30:00Z",
          updatedAt: "2025-06-25T18:30:00Z",
        },
      },
    },
  })
  @Get()
  findAll() {
    return this.trilhaService.findAll();
  }

  @ApiOperation({
    summary: "Listar trilhas com critérios",
    description: "Retorna todas as trilhas com seus critérios associados",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de trilhas com critérios",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Desenvolvimento Full Stack",
          createdAt: "2025-06-25T18:30:00Z",
          updatedAt: "2025-06-25T18:30:00Z",
          criterio: [
            {
              id: 1,
              name: "Qualidade do Código",
              tipo: "técnico",
              peso: 30.0,
              description: "Avaliação da qualidade e estrutura do código",
              enabled: true,
            },
          ],
        },
      },
    },
  })
  @Get("with-criterios")
  findAllWithCriterios() {
    return this.trilhaService.findAllWithCriterios();
  }

  @ApiOperation({
    summary: "Listar trilhas com usuários",
    description: "Retorna todas as trilhas com seus usuários associados",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de trilhas com usuários",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Desenvolvimento Full Stack",
          createdAt: "2025-06-25T18:30:00Z",
          updatedAt: "2025-06-25T18:30:00Z",
          users: [
            {
              id: 1,
              name: "João Silva",
              email: "joao@example.com",
            },
          ],
        },
      },
    },
  })
  @Get("with-users")
  findAllWithUsers() {
    return this.trilhaService.findAllWithUsers();
  }

  @ApiOperation({
    summary: "Listar trilhas completas",
    description: "Retorna todas as trilhas com usuários e critérios associados",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de trilhas completas",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Desenvolvimento Full Stack",
          createdAt: "2025-06-25T18:30:00Z",
          updatedAt: "2025-06-25T18:30:00Z",
          users: [
            {
              id: 1,
              name: "João Silva",
              email: "joao@example.com",
            },
          ],
          criterio: [
            {
              id: 1,
              name: "Qualidade do Código",
              tipo: "técnico",
              peso: 30.0,
              description: "Avaliação da qualidade e estrutura do código",
              enabled: true,
            },
          ],
        },
      },
    },
  })
  @Get("complete")
  findAllComplete() {
    return this.trilhaService.findAllComplete();
  }

  @ApiOperation({
    summary: "Atualizar múltiplas trilhas",
    description: "Atualiza múltiplas trilhas em uma única operação",
  })
  @ApiResponse({
    status: 200,
    description: "Trilhas atualizadas com sucesso",
    schema: {
      example: {
        trilhas: [
          {
            id: 1,
            name: "Desenvolvimento Full Stack Avançado",
            createdAt: "2025-06-25T18:30:00Z",
            updatedAt: "2025-06-25T19:30:00Z",
          },
          {
            id: 2,
            name: "Data Science & Machine Learning",
            createdAt: "2025-06-25T18:30:00Z",
            updatedAt: "2025-06-25T19:30:00Z",
          },
        ],
        count: 2,
        updated: [1, 2],
        notFound: [],
      },
    },
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @Patch("bulk")
  updateBulk(@Body() bulkUpdateTrilhaDto: BulkUpdateTrilhaDto) {
    return this.trilhaService.updateBulk(bulkUpdateTrilhaDto);
  }

  @ApiOperation({
    summary: "Listar trilhas com critérios agrupados",
    description:
      "Retorna todas as trilhas com seus critérios agrupados por tipo",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de trilhas com critérios agrupados por tipo",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          name: "Desenvolvimento Full Stack",
          createdAt: "2025-06-25T18:30:00Z",
          updatedAt: "2025-06-25T18:30:00Z",
          criteriosGrouped: {
            comportamental: [
              {
                id: 1,
                name: "Trabalho em Equipe",
                tipo: "comportamental",
                peso: 20.0,
                description: "Capacidade de trabalhar colaborativamente",
                idCiclo: 1,
                enabled: true,
              },
              {
                id: 2,
                name: "Comunicação",
                tipo: "comportamental",
                peso: 15.0,
                description: "Habilidades de comunicação efetiva",
                idCiclo: 1,
                enabled: true,
              },
            ],
            tecnico: [
              {
                id: 3,
                name: "Qualidade do Código",
                tipo: "tecnico",
                peso: 30.0,
                description: "Avaliação da qualidade e estrutura do código",
                idCiclo: 1,
                enabled: true,
              },
            ],
            gestao: [
              {
                id: 4,
                name: "Gestão de Projetos",
                tipo: "gestao",
                peso: 25.0,
                description: "Capacidade de gerenciar projetos efetivamente",
                idCiclo: 1,
                enabled: true,
              },
            ],
            negocios: [
              {
                id: 5,
                name: "Visão de Negócio",
                tipo: "negocios",
                peso: 10.0,
                description: "Compreensão do contexto de negócios",
                idCiclo: 1,
                enabled: true,
              },
            ],
          },
        },
      },
    },
  })
  @Get("with-criterios-grouped")
  findAllWithCriteriosGrouped() {
    return this.trilhaService.findAllWithCriteriosGrouped();
  }

  @ApiOperation({
    summary: "Buscar trilha com critérios agrupados por ID",
    description:
      "Retorna uma trilha específica com seus critérios agrupados por tipo",
  })
  @ApiParam({ name: "id", description: "ID da trilha", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Trilha com critérios agrupados por tipo",
    schema: {
      example: {
        id: 1,
        name: "Desenvolvimento Full Stack",
        createdAt: "2025-06-25T18:30:00Z",
        updatedAt: "2025-06-25T18:30:00Z",
        criteriosGrouped: {
          comportamental: [
            {
              id: 1,
              name: "Trabalho em Equipe",
              tipo: "comportamental",
              peso: 20.0,
              description: "Capacidade de trabalhar colaborativamente",
              idCiclo: 1,
              enabled: true,
            },
          ],
          tecnico: [
            {
              id: 3,
              name: "Qualidade do Código",
              tipo: "tecnico",
              peso: 30.0,
              description: "Avaliação da qualidade e estrutura do código",
              idCiclo: 1,
              enabled: true,
            },
          ],
          gestao: [
            {
              id: 4,
              name: "Gestão de Projetos",
              tipo: "gestao",
              peso: 25.0,
              description: "Capacidade de gerenciar projetos efetivamente",
              idCiclo: 1,
              enabled: true,
            },
          ],
          negocios: [
            {
              id: 5,
              name: "Visão de Negócio",
              tipo: "negocios",
              peso: 10.0,
              description: "Compreensão do contexto de negócios",
              idCiclo: 1,
              enabled: true,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Trilha não encontrada" })
  @Get(":id/with-criterios-grouped")
  findOneWithCriteriosGrouped(@Param("id") id: string) {
    return this.trilhaService.findOneWithCriteriosGrouped(+id);
  }

  // === PARAMETERIZED ROUTES - MUST BE AT THE END ===

  @ApiOperation({
    summary: "Buscar trilha por ID",
    description: "Retorna uma trilha específica pelo seu ID",
  })
  @ApiParam({ name: "id", description: "ID da trilha", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Trilha encontrada",
    schema: {
      example: {
        id: 1,
        name: "Desenvolvimento Full Stack",
        createdAt: "2025-06-25T18:30:00Z",
        updatedAt: "2025-06-25T18:30:00Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Trilha não encontrada" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.trilhaService.findOne(+id);
  }

  @ApiOperation({
    summary: "Atualizar trilha",
    description: "Atualiza uma trilha existente",
  })
  @ApiParam({ name: "id", description: "ID da trilha", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Trilha atualizada com sucesso",
    schema: {
      example: {
        id: 1,
        name: "Desenvolvimento Full Stack Avançado",
        createdAt: "2025-06-25T18:30:00Z",
        updatedAt: "2025-06-25T19:30:00Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Trilha não encontrada" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTrilhaDto: UpdateTrilhaDto) {
    return this.trilhaService.update(+id, updateTrilhaDto);
  }

  @ApiOperation({
    summary: "Excluir trilha",
    description: "Remove uma trilha do sistema",
  })
  @ApiParam({ name: "id", description: "ID da trilha", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Trilha excluída com sucesso",
    schema: {
      example: { id: 1 },
    },
  })
  @ApiResponse({ status: 404, description: "Trilha não encontrada" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.trilhaService.remove(+id);
  }

  @ApiOperation({
    summary: "Listar trilhas com critérios por ID",
    description: "Retorna uma trilha específica com seus critérios associados",
  })
  @ApiParam({ name: "id", description: "ID da trilha", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Trilha com critérios",
    schema: {
      example: {
        id: 1,
        name: "Desenvolvimento Full Stack",
        createdAt: "2025-06-25T18:30:00Z",
        updatedAt: "2025-06-25T18:30:00Z",
        criterio: [
          {
            id: 1,
            name: "Qualidade do Código",
            tipo: "técnico",
            peso: 30.0,
            description: "Avaliação da qualidade e estrutura do código",
            enabled: true,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: "Trilha não encontrada" })
  @Get(":id/with-criterios")
  findOneWithCriterios(@Param("id") id: string) {
    return this.trilhaService.findOneWithCriterios(+id);
  }

  @ApiOperation({
    summary: "Listar trilha com usuários por ID",
    description: "Retorna uma trilha específica com seus usuários associados",
  })
  @ApiParam({ name: "id", description: "ID da trilha", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Trilha com usuários",
    schema: {
      example: {
        id: 1,
        name: "Desenvolvimento Full Stack",
        createdAt: "2025-06-25T18:30:00Z",
        updatedAt: "2025-06-25T18:30:00Z",
        users: [
          {
            id: 1,
            name: "João Silva",
            email: "joao@example.com",
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: "Trilha não encontrada" })
  @Get(":id/with-users")
  findOneWithUsers(@Param("id") id: string) {
    return this.trilhaService.findOneWithUsers(+id);
  }

  @ApiOperation({
    summary: "Listar trilha completa por ID",
    description:
      "Retorna uma trilha específica com usuários e critérios associados",
  })
  @ApiParam({ name: "id", description: "ID da trilha", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Trilha completa",
    schema: {
      example: {
        id: 1,
        name: "Desenvolvimento Full Stack",
        createdAt: "2025-06-25T18:30:00Z",
        updatedAt: "2025-06-25T18:30:00Z",
        users: [
          {
            id: 1,
            name: "João Silva",
            email: "joao@example.com",
          },
        ],
        criterio: [
          {
            id: 1,
            name: "Qualidade do Código",
            tipo: "técnico",
            peso: 30.0,
            description: "Avaliação da qualidade e estrutura do código",
            enabled: true,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: "Trilha não encontrada" })
  @Get(":id/complete")
  findOneComplete(@Param("id") id: string) {
    return this.trilhaService.findOneComplete(+id);
  }
}
