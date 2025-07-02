import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CicleService } from './cicle.service';
import { CreateCicleDto } from './dto/create-cicle.dto';
import { UpdateCicleDto } from './dto/update-cicle.dto';
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Cicle")
@Controller('cicle')
export class CicleController {
  constructor(private readonly cicleService: CicleService) {}

  @Post()
  @ApiOperation({ summary: "Cria um ciclo" })
  @ApiResponse({ status: 200, description: "Ciclo criado com sucesso." })
  create(@Body() createCicleDto: CreateCicleDto) {
    return this.cicleService.create(createCicleDto);
  }

  @Get()
  @ApiOperation({ summary: "Lista todos os ciclos" })
  @ApiResponse({
    status: 200,
    description: "Lista de ciclos retornada com sucesso.",
  })
  findAll() {
    return this.cicleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Busca um ciclo pelo ID" })
  @ApiResponse({ status: 200, description: "Ciclo retornado com sucesso." })
  findOne(@Param('id') id: string) {
    return this.cicleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCicleDto: UpdateCicleDto) {
    return this.cicleService.update(+id, updateCicleDto);
  }

}
