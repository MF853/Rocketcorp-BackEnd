import { Controller, Get, Post, Body, Patch, Param } from "@nestjs/common";
import { CicleService } from "./cicle.service";
import { CreateCicleDto } from "./dto/create-cicle.dto";
import { UpdateCicleDto } from "./dto/update-cicle.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Cicle")
@Controller("cicle")
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

  @Get("current")
  @ApiOperation({ summary: "Retorna o ciclo atual (aberto)" })
  @ApiResponse({
    status: 200,
    description: "Ciclo atual retornado com sucesso.",
  })
  async getCicloAtual() {
    return await this.cicleService.getCicloAtual();
  }

  @Get(":id")
  @ApiOperation({ summary: "Busca um ciclo pelo ID" })
  @ApiResponse({ status: 200, description: "Ciclo retornado com sucesso." })
  findOne(@Param("id") id: string) {
    return this.cicleService.findOne(+id);
  }

  @Get(":id/users")
  @ApiOperation({ summary: "Lista todos os colaboradores de um ciclo" })
  @ApiResponse({
    status: 200,
    description: "Colaboradores retornados com sucesso.",
  })
  async getUsersByCiclo(@Param("id") id: string) {
    return this.cicleService.getUsersByCiclo(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza um ciclo por ID" })
  @ApiResponse({ status: 200, description: "Ciclo atualizado com sucesso" })
  async update(
    @Param("id") id: number,
    @Body() updateCicleDto: UpdateCicleDto
  ) {
    const updated = await this.cicleService.update(id, updateCicleDto);
    return { message: "Ciclo atualizado com sucesso", ciclo: updated };
  }
}
