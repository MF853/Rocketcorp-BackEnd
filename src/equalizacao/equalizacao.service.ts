import { Injectable } from "@nestjs/common";
import { CreateEqualizacaoDto } from "./dto/create-equalizacao.dto";
import { UpdateEqualizacaoDto } from "./dto/update-equalizacao.dto";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import { EqualizacaoRepository } from "./equalizacao.repository";
import { UsersService } from "../users/users.service";

@Injectable()
export class EqualizacaoService {
  constructor(
    private readonly equalizacaoRepository: EqualizacaoRepository,
    private readonly usersService: UsersService
  ) {}

  async create(
    createEqualizacaoDto: CreateEqualizacaoDto
  ): Promise<EqualizacaoResponseDto> {
    // Get user statistics for the cycle
    const stats = await this.usersService.getUserStatistics(
      createEqualizacaoDto.idAvaliado,
      createEqualizacaoDto.idCiclo
    );

    // Create the equalizacao with the statistics
    return await this.equalizacaoRepository.createEqualizacao(
      createEqualizacaoDto,
      stats?.autoavaliacaoAverage || 0,
      stats?.avaliacaoGestorAvg || 0,
      stats?.avaliacao360Avg || 0
    );
  }

  findAll() {
    return `This action returns all equalizacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} equalizacao`;
  }

  update(id: number, updateEqualizacaoDto: UpdateEqualizacaoDto) {
    return `This action updates a #${id} equalizacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} equalizacao`;
  }

  async getEqualizacoesByCycle(
    idCiclo: number
  ): Promise<EqualizacaoResponseDto[]> {
    const result = await this.equalizacaoRepository.getEqualizacoesByCycle(
      idCiclo
    );
    console.log(`Equalizações for cycle ${idCiclo}:`, result);
    return result;
  }
}
