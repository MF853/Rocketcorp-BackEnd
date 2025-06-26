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
  @Get(":id/with-criterios")
  findOneWithCriterios(@Param("id") id: string) {
    return this.trilhaService.findOneWithCriterios(+id);
  }

  @Get(":id/with-users")
  findOneWithUsers(@Param("id") id: string) {
    return this.trilhaService.findOneWithUsers(+id);
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
  @Get(":id/complete")
  findOneComplete(@Param("id") id: string) {
    return this.trilhaService.findOneComplete(+id);
  }
}
