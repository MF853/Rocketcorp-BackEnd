import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Avaliacao')
@Controller('avaliacao')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova avaliação' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso.' })
  create(@Body() createAvaliacaoDto: CreateAvaliacaoDto) {
    return this.avaliacaoService.create(createAvaliacaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as avaliações' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações retornada com sucesso.' })
  findAll() {
    return this.avaliacaoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma avaliação pelo ID' })
  @ApiResponse({ status: 200, description: 'Avaliação retornada com sucesso.' })
  findOne(@Param('id') id: string) {
    return this.avaliacaoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma avaliação pelo ID' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada com sucesso.' })
  update(@Param('id') id: string, @Body() updateAvaliacaoDto: UpdateAvaliacaoDto) {
    return this.avaliacaoService.update(+id, updateAvaliacaoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma avaliação pelo ID' })
  @ApiResponse({ status: 200, description: 'Avaliação removida com sucesso.' })
  remove(@Param('id') id: string) {
    return this.avaliacaoService.remove(+id);
  }
}
