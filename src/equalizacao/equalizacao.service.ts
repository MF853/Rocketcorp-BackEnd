import { Injectable } from "@nestjs/common";
import { CreateEqualizacaoDto } from "./dto/create-equalizacao.dto";
import { UpdateEqualizacaoDto } from "./dto/update-equalizacao.dto";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import { EqualizacaoRepository } from "./equalizacao.repository";
import { UsersService } from "../users/users.service";
import { CicleService } from "../cicle/cicle.service";

@Injectable()
export class EqualizacaoService {
  constructor(
    private readonly equalizacaoRepository: EqualizacaoRepository,
    private readonly usersService: UsersService,
    private readonly cicleService: CicleService
  ) {}

  async create(
    createEqualizacaoDto: CreateEqualizacaoDto
  ): Promise<EqualizacaoResponseDto> {
    const stats = await this.usersService.getUserStatistics(
      createEqualizacaoDto.idAvaliado,
      createEqualizacaoDto.idCiclo
    );

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

  async update(
    updateEqualizacaoDto: UpdateEqualizacaoDto
  ): Promise<EqualizacaoResponseDto> {
    if (!updateEqualizacaoDto.id) {
      throw new Error("ID is required in the DTO");
    }
    return await this.equalizacaoRepository.updateEqualizacao(
      updateEqualizacaoDto.id,
      updateEqualizacaoDto
    );
  }

  remove(id: number) {
    return `This action removes a #${id} equalizacao`;
  }
  async getEqualizacoesCycleInRevisao(): Promise<EqualizacaoResponseDto[]> {
    const currentCycle = await this.cicleService.getCycleInRevisaoComite();

    return await this.getEqualizacoesByCycle(currentCycle.id);
  }

  async getEqualizacoesByCycle(
    idCiclo: number
  ): Promise<EqualizacaoResponseDto[]> {
    const usersData = await this.equalizacaoRepository.getEqualizacoesByCycle(
      idCiclo
    );

    const results: EqualizacaoResponseDto[] = [];

    for (const userData of usersData) {
      const { user, existingEqualizacao, idCiclo: cycleId } = userData;

      if (existingEqualizacao) {
        results.push({
          idEqualizacao: existingEqualizacao.id.toString(),
          idAvaliador: existingEqualizacao.idAvaliador.toString(),
          idAvaliado: existingEqualizacao.idAvaliado.toString(),
          idCiclo: cycleId.toString(),
          nomeAvaliado: user.name,
          cargoAvaliado: user.cargo,
          notaAutoavaliacao: existingEqualizacao.mediaAutoavaliacao,
          notaGestor: existingEqualizacao.mediaAvaliacaoGestor,
          notaAvaliacao360: existingEqualizacao.mediaAvaliacao360,
          notaFinal: existingEqualizacao.notaFinal,
          justificativa: existingEqualizacao.justificativa,
          resumoIA: user.resumoIA,
          status:
            existingEqualizacao.status === "FINALIZADO"
              ? "Finalizado"
              : "Pendente",
        });
      } else {
        const stats = await this.usersService.getUserStatistics(
          user.id,
          cycleId
        );

        results.push({
          idEqualizacao: `temp_${user.id}_${cycleId}`,
          idAvaliador: user.id.toString(),
          idAvaliado: user.id.toString(),
          idCiclo: cycleId.toString(),
          nomeAvaliado: user.name,
          cargoAvaliado: user.cargo,
          notaAutoavaliacao: stats?.autoavaliacaoAverage || null,
          notaGestor: stats?.avaliacaoGestorAvg || null,
          notaAvaliacao360: stats?.avaliacao360Avg || null,
          notaFinal: null,
          justificativa: null,
          resumoIA: user.resumoIA,
          status: "Pendente",
        });
      }
    }

    return results.sort((a, b) => a.nomeAvaliado.localeCompare(b.nomeAvaliado));
  }

  async getEqualizacaoByCicloAndAvaliado(
    idCiclo: number,
    idAvaliado: number
  ): Promise<EqualizacaoResponseDto | null> {
    const usersData = await this.equalizacaoRepository.getEqualizacoesByCycle(
      idCiclo
    );
    const userData = usersData.find((u) => u.user.id === idAvaliado);
    if (!userData) return null;

    const { user, existingEqualizacao, idCiclo: cycleId } = userData;
    if (existingEqualizacao) {
      return {
        idEqualizacao: existingEqualizacao.id.toString(),
        idAvaliador: existingEqualizacao.idAvaliador.toString(),
        idAvaliado: existingEqualizacao.idAvaliado.toString(),
        idCiclo: cycleId.toString(),
        nomeAvaliado: user.name,
        cargoAvaliado: user.cargo,
        notaAutoavaliacao: existingEqualizacao.mediaAutoavaliacao,
        notaGestor: existingEqualizacao.mediaAvaliacaoGestor,
        notaAvaliacao360: existingEqualizacao.mediaAvaliacao360,
        notaFinal: existingEqualizacao.notaFinal,
        justificativa: existingEqualizacao.justificativa,
        resumoIA: user.resumoIA,
        status:
          existingEqualizacao.status === "FINALIZADO"
            ? "Finalizado"
            : "Pendente",
      };
    } else {
      const stats = await this.usersService.getUserStatistics(user.id, cycleId);
      return {
        idEqualizacao: `temp_${user.id}_${cycleId}`,
        idAvaliador: user.id.toString(),
        idAvaliado: user.id.toString(),
        idCiclo: cycleId.toString(),
        nomeAvaliado: user.name,
        cargoAvaliado: user.cargo,
        notaAutoavaliacao: stats?.autoavaliacaoAverage || null,
        notaGestor: stats?.avaliacaoGestorAvg || null,
        notaAvaliacao360: stats?.avaliacao360Avg || null,
        notaFinal: null,
        justificativa: null,
        resumoIA: user.resumoIA,
        status: "Pendente",
      };
    }
  }

  async getEqualizacoesByAvaliado(
    idAvaliado: number
  ): Promise<EqualizacaoResponseDto[]> {
    const equalizacoes =
      await this.equalizacaoRepository.getEqualizacoesByAvaliado(idAvaliado);
    return equalizacoes.map((eq) => ({
      idEqualizacao: eq.id.toString(),
      idAvaliador: eq.idAvaliador.toString(),
      idAvaliado: eq.idAvaliado.toString(),
      idCiclo: eq.idCiclo.toString(),
      nomeAvaliado: eq.nomeAvaliado,
      cargoAvaliado: eq.cargoAvaliado,
      notaAutoavaliacao: eq.mediaAutoavaliacao,
      notaGestor: eq.mediaAvaliacaoGestor,
      notaAvaliacao360: eq.mediaAvaliacao360,
      notaFinal: eq.notaFinal,
      justificativa: eq.justificativa,
      resumoIA: eq.resumoIA,
      status: eq.status === "FINALIZADO" ? "Finalizado" : "Pendente",
    }));
  }
}
