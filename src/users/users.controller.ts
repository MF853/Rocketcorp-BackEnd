import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserStatisticsResponseDto } from "./dto/user-statistics-response.dto";
import { UserPerformanceResponseDto } from "./dto/performance-data.dto";
import { UserEvaluationCyclesResponseDto } from "./dto/evaluation-cycle.dto";
import { UserHistoryResponseDto } from "./dto/user-history.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Lista todos os usuários" })
  @ApiResponse({
    status: 200,
    description: "Lista de usuários retornada com sucesso.",
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get("mentores")
  @ApiOperation({ summary: "Lista todos os usuários com role mentor" })
  @ApiResponse({
    status: 200,
    description: "Lista de mentores retornada com sucesso.",
  })
  findMentores() {
    return this.usersService.findMentores();
  }

  @Get(":id")
  @ApiOperation({ summary: "Busca um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário retornado com sucesso." })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Get("email/:email")
  @ApiOperation({ summary: "Busca um usuário pelo email" })
  @ApiResponse({ status: 200, description: "Usuário retornado com sucesso." })
  findByEmail(@Param("email") email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get(":id/liderados")
  @ApiOperation({ summary: "Lista todos os liderados de um gestor" })
  @ApiResponse({
    status: 200,
    description: "Lista de liderados retornada com sucesso.",
  })
  findLideradosByGestor(@Param("id") id: string) {
    return this.usersService.findLideradosByGestor(+id);
  }

  @Get(":id/mentorados")
  @ApiOperation({ summary: "Lista todos os mentorados de um mentor" })
  @ApiResponse({
    status: 200,
    description: "Lista de mentorados retornada com sucesso.",
  })
  findMentorados(@Param("id") id: string) {
    return this.usersService.findMentorados(+id);
  }

  @Get("trilha/:trilhaId")
  @ApiOperation({ summary: "Lista todos os usuários de uma trilha" })
  @ApiResponse({
    status: 200,
    description: "Lista de usuários da trilha retornada com sucesso.",
  })
  findByTrilha(@Param("trilhaId") trilhaId: string) {
    return this.usersService.findByTrilha(+trilhaId);
  }

  @Get("equipe/:equipeId")
  @ApiOperation({ summary: "Lista todos os usuários de uma equipe" })
  @ApiResponse({
    status: 200,
    description: "Lista de usuários da equipe retornada com sucesso.",
  })
  findByEquipe(@Param("equipeId") equipeId: string) {
    return this.usersService.findByEquipe(+equipeId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso." })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário removido com sucesso." })
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }

  @Get(":id/statistics")
  @ApiOperation({
    summary: "Busca estatísticas de avaliações de um usuário",
    description:
      "Retorna médias de autoavaliação, avaliação do gestor e avaliação 360° para um usuário específico. Opcionalmente filtrado por ciclo.",
  })
  @ApiResponse({
    status: 200,
    description: "Estatísticas do usuário retornadas com sucesso.",
    type: UserStatisticsResponseDto,
  })
  @ApiParam({ name: "id", description: "ID do usuário" })
  @ApiQuery({
    name: "idCiclo",
    required: false,
    description: "ID do ciclo para filtrar as estatísticas",
    type: Number,
  })
  async getUserStatistics(
    @Param("id") id: string,
    @Query("idCiclo") idCiclo?: string
  ): Promise<UserStatisticsResponseDto> {
    const cycleId = idCiclo ? parseInt(idCiclo, 10) : undefined;
    return this.usersService.getUserStatistics(+id, cycleId);
  }

  @Get("statistics/ciclo/:cicloId")
  @ApiOperation({
    summary:
      "Busca estatísticas de avaliações de todos os usuários em um ciclo",
    description:
      "Retorna médias de autoavaliação, avaliação do gestor e avaliação 360° para todos os usuários que possuem avaliações no ciclo especificado.",
  })
  @ApiParam({
    name: "cicloId",
    description: "ID do ciclo para buscar estatísticas",
    type: "number",
  })
  @ApiResponse({
    status: 200,
    description:
      "Estatísticas de todos os usuários no ciclo retornadas com sucesso.",
    type: [UserStatisticsResponseDto],
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
  getAllUsersStatisticsByCycle(
    @Param("cicloId") cicloId: string
  ): Promise<UserStatisticsResponseDto[]> {
    return this.usersService.getAllUsersStatisticsByCycle(+cicloId);
  }

  @Get(":id/performance")
  @ApiOperation({
    summary: "Busca dados de performance de um usuário",
    description:
      "Retorna o histórico de notas finais das equalizações do usuário organizadas por semestre.",
  })
  @ApiResponse({
    status: 200,
    description: "Dados de performance do usuário retornados com sucesso.",
    type: UserPerformanceResponseDto,
  })
  @ApiParam({ name: "id", description: "ID do usuário" })
  async getUserPerformance(
    @Param("id") id: string
  ): Promise<UserPerformanceResponseDto> {
    return this.usersService.getUserPerformanceData(+id);
  }

  @Get(":id/evaluation-cycles")
  @ApiOperation({
    summary: "Busca ciclos de avaliação de um usuário",
    description:
      "Retorna informações detalhadas sobre os ciclos de avaliação do usuário, incluindo status, notas e resumos.",
  })
  @ApiResponse({
    status: 200,
    description: "Ciclos de avaliação do usuário retornados com sucesso.",
    type: UserEvaluationCyclesResponseDto,
  })
  @ApiParam({ name: "id", description: "ID do usuário" })
  async getUserEvaluationCycles(
    @Param("id") id: string
  ): Promise<UserEvaluationCyclesResponseDto> {
    return this.usersService.getUserEvaluationCycles(+id);
  }

  @Get(":id/history")
  @ApiOperation({
    summary: "Busca histórico completo de avaliações de um usuário",
    description:
      "Retorna histórico completo incluindo performance atual, crescimento, dados históricos e ciclos de avaliação detalhados.",
  })
  @ApiResponse({
    status: 200,
    description: "Histórico do usuário retornado com sucesso.",
    type: UserHistoryResponseDto,
  })
  @ApiParam({ name: "id", description: "ID do usuário" })
  async getUserHistory(
    @Param("id") id: string
  ): Promise<UserHistoryResponseDto> {
    return this.usersService.getUserHistory(+id);
  }

  @Get("by-equipe-com-gestor/:equipeId")
  @ApiOperation({ summary: "Lista todos os membros e o gestor de uma equipe" })
  @Get("by-equipe-com-gestor/:equipeId")
  @ApiOperation({ summary: "Lista todos os membros e o gestor de uma equipe" })
  @ApiResponse({
    status: 200,
    description: "Lista de membros e gestor da equipe retornada com sucesso.",
  })
  getMembrosAndGestorByEquipe(@Param("equipeId") equipeId: string) {
    return this.usersService.getMembrosAndGestorByEquipe(+equipeId);
  }
}
