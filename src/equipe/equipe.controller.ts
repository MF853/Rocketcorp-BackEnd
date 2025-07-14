import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Equipe')
@Controller('equipe')
export class EquipeController {
  constructor(private readonly equipeService: EquipeService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar equipe',
    description: 'Cria uma nova equipe com um gestor e membros opcionais'
  })
  @ApiResponse({
    status: 201,
    description: 'Equipe criada com sucesso',
    schema: {
      example: {
        id: 1,
        nome: 'Squad Rocket',
        descricao: 'Equipe responsável pelo produto Rocket',
        idGestor: 2,
        createdAt: '2025-01-13T22:00:00.000Z',
        updatedAt: '2025-01-13T22:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createEquipeDto: CreateEquipeDto) {
    return this.equipeService.create(createEquipeDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar equipes',
    description: 'Retorna todas as equipes com seus gestores e membros'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de equipes retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        example: {
          id: 1,
          nome: 'Squad Rocket',
          descricao: 'Equipe responsável pelo produto Rocket',
          idGestor: 2,
          gestor: {
            id: 2,
            name: 'João Silva',
            email: 'joao@example.com'
          },
          membros: [
            {
              id: 3,
              name: 'Maria Santos',
              email: 'maria@example.com'
            }
          ],
          createdAt: '2025-01-13T22:00:00.000Z',
          updatedAt: '2025-01-13T22:00:00.000Z'
        }
      }
    }
  })
  findAll() {
    return this.equipeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar equipe por ID',
    description: 'Retorna uma equipe específica com seus gestores e membros'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da equipe',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Equipe retornada com sucesso',
    schema: {
      example: {
        id: 1,
        nome: 'Squad Rocket',
        descricao: 'Equipe responsável pelo produto Rocket',
        idGestor: 2,
        gestor: {
          id: 2,
          name: 'João Silva',
          email: 'joao@example.com'
        },
        membros: [
          {
            id: 3,
            name: 'Maria Santos',
            email: 'maria@example.com'
          }
        ],
        createdAt: '2025-01-13T22:00:00.000Z',
        updatedAt: '2025-01-13T22:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  findOne(@Param('id') id: string) {
    return this.equipeService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar equipe',
    description: 'Atualiza os dados de uma equipe existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da equipe',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Equipe atualizada com sucesso',
    schema: {
      example: {
        id: 1,
        nome: 'Squad Rocket Atualizado',
        descricao: 'Equipe responsável pelo produto Rocket - Versão 2.0',
        idGestor: 2,
        createdAt: '2025-01-13T22:00:00.000Z',
        updatedAt: '2025-01-13T22:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  update(@Param('id') id: string, @Body() updateEquipeDto: UpdateEquipeDto) {
    return this.equipeService.update(+id, updateEquipeDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Remover equipe',
    description: 'Remove uma equipe do sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da equipe',
    type: 'number',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Equipe removida com sucesso',
    schema: {
      example: {
        id: 1,
        nome: 'Squad Rocket',
        descricao: 'Equipe responsável pelo produto Rocket',
        idGestor: 2,
        createdAt: '2025-01-13T22:00:00.000Z',
        updatedAt: '2025-01-13T22:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  remove(@Param('id') id: string) {
    return this.equipeService.remove(+id);
  }
} 