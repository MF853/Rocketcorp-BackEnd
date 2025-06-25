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
import { ReferenciaService } from "./referencia.service";
import {
  CreateReferenciaDto,
  BulkCreateReferenciaDto,
} from "./dto/create-referencia.dto";
import { UpdateReferenciaDto } from "./dto/update-referencia.dto";

@ApiTags("Referências")
@Controller("referencia")
export class ReferenciaController {
  constructor(private readonly referenciaService: ReferenciaService) {}

  @ApiOperation({
    summary: "Criar nova referência",
    description:
      "Cria uma nova referência entre dois usuários em um ciclo específico",
  })
  @ApiResponse({
    status: 201,
    description: "Referência criada com sucesso",
    schema: {
      example: {
        id: 1,
        idReferenciador: 1,
        idReferenciado: 2,
        idCiclo: 1,
        justificativa: "Excelente profissional...",
        createdAt: "2025-06-24T18:30:00Z",
        updatedAt: "2025-06-24T18:30:00Z",
        referenciador: {
          id: 1,
          name: "João Silva",
          email: "joao@example.com",
        },
        referenciado: {
          id: 2,
          name: "Maria Santos",
          email: "maria@example.com",
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Referência já existe para esta combinação",
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @Post()
  create(@Body() createReferenciaDto: CreateReferenciaDto) {
    return this.referenciaService.create(createReferenciaDto);
  }

  @ApiOperation({
    summary: "Criar múltiplas referências",
    description: "Cria múltiplas referências em uma única operação",
  })
  @ApiResponse({
    status: 201,
    description: "Referências criadas com sucesso",
    schema: {
      example: {
        referencias: [
          /* array de referências */
        ],
        count: 3,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Uma ou mais referências já existem",
  })
  @Post("bulk")
  createBulk(@Body() bulkCreateReferenciaDto: BulkCreateReferenciaDto) {
    return this.referenciaService.createBulk(bulkCreateReferenciaDto);
  }

  @ApiOperation({
    summary: "Listar todas as referências",
    description:
      "Retorna todas as referências com dados dos usuários envolvidos",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de referências",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          idReferenciador: 1,
          idReferenciado: 2,
          idCiclo: 1,
          justificativa: "Excelente profissional...",
          createdAt: "2025-06-24T18:30:00Z",
          referenciador: {
            id: 1,
            name: "João Silva",
            email: "joao@example.com",
          },
          referenciado: {
            id: 2,
            name: "Maria Santos",
            email: "maria@example.com",
          },
        },
      },
    },
  })
  @Get()
  findAll() {
    return this.referenciaService.findAll();
  }

  @ApiOperation({
    summary: "Buscar referência por ID",
    description: "Retorna uma referência específica pelo seu ID",
  })
  @ApiParam({ name: "id", description: "ID da referência", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Referência encontrada",
    schema: {
      example: {
        id: 1,
        idReferenciador: 1,
        idReferenciado: 2,
        idCiclo: 1,
        justificativa: "Excelente profissional...",
        referenciador: { id: 1, name: "João Silva", email: "joao@example.com" },
        referenciado: {
          id: 2,
          name: "Maria Santos",
          email: "maria@example.com",
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Referência não encontrada" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.referenciaService.findOne(+id);
  }

  @ApiOperation({
    summary: "Buscar referências por referenciador",
    description:
      "Retorna todas as referências feitas por um usuário específico",
  })
  @ApiParam({
    name: "id",
    description: "ID do usuário referenciador",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Lista de referências do usuário",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          idReferenciador: 1,
          idReferenciado: 2,
          idCiclo: 1,
          justificativa: "Excelente profissional...",
          referenciado: {
            id: 2,
            name: "Maria Santos",
            email: "maria@example.com",
          },
        },
      },
    },
  })
  @Get("referenciador/:id")
  findByReferenciador(@Param("id") id: string) {
    return this.referenciaService.findByReferenciador(+id);
  }

  @ApiOperation({
    summary: "Buscar referências por referenciado",
    description:
      "Retorna todas as referências recebidas por um usuário específico",
  })
  @ApiParam({
    name: "id",
    description: "ID do usuário referenciado",
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: "Lista de referências recebidas pelo usuário",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          idReferenciador: 1,
          idReferenciado: 2,
          idCiclo: 1,
          justificativa: "Excelente profissional...",
          referenciador: {
            id: 1,
            name: "João Silva",
            email: "joao@example.com",
          },
        },
      },
    },
  })
  @Get("referenciado/:id")
  findByReferenciado(@Param("id") id: string) {
    return this.referenciaService.findByReferenciado(+id);
  }

  @ApiOperation({
    summary: "Buscar referências por ciclo",
    description: "Retorna todas as referências de um ciclo específico",
  })
  @ApiParam({ name: "id", description: "ID do ciclo", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lista de referências do ciclo",
    schema: {
      type: "array",
      items: {
        example: {
          id: 1,
          idReferenciador: 1,
          idReferenciado: 2,
          idCiclo: 1,
          justificativa: "Excelente profissional...",
          referenciador: {
            id: 1,
            name: "João Silva",
            email: "joao@example.com",
          },
          referenciado: {
            id: 2,
            name: "Maria Santos",
            email: "maria@example.com",
          },
        },
      },
    },
  })
  @Get("ciclo/:id")
  findByCiclo(@Param("id") id: string) {
    return this.referenciaService.findByCiclo(+id);
  }

  @ApiOperation({
    summary: "Atualizar referência",
    description: "Atualiza uma referência existente",
  })
  @ApiParam({ name: "id", description: "ID da referência", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Referência atualizada com sucesso",
    schema: {
      example: {
        id: 1,
        idReferenciador: 1,
        idReferenciado: 2,
        idCiclo: 1,
        justificativa: "Justificativa atualizada...",
        referenciador: { id: 1, name: "João Silva", email: "joao@example.com" },
        referenciado: {
          id: 2,
          name: "Maria Santos",
          email: "maria@example.com",
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Referência não encontrada" })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateReferenciaDto: UpdateReferenciaDto
  ) {
    return this.referenciaService.update(+id, updateReferenciaDto);
  }

  @ApiOperation({
    summary: "Excluir referência",
    description: "Remove uma referência do sistema",
  })
  @ApiParam({ name: "id", description: "ID da referência", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Referência excluída com sucesso",
    schema: {
      example: { id: 1 },
    },
  })
  @ApiResponse({ status: 404, description: "Referência não encontrada" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.referenciaService.remove(+id);
  }
}
