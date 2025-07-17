import { Injectable, ConflictException } from "@nestjs/common";
import { CreateEqualizacaoDto } from "./dto/create-equalizacao.dto";
import { UpdateEqualizacaoDto } from "./dto/update-equalizacao.dto";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import { EqualizacaoRepository } from "./equalizacao.repository";
import { UsersService } from "../users/users.service";
import { CicleService } from "../cicle/cicle.service";
import { CryptoService } from "../crypto/crypto.service";

@Injectable()
export class EqualizacaoService {
  constructor(
    private readonly equalizacaoRepository: EqualizacaoRepository,
    private readonly usersService: UsersService,
    private readonly cicleService: CicleService,
    private readonly cryptoService: CryptoService
  ) {}

  async create(
    createEqualizacaoDto: CreateEqualizacaoDto
  ): Promise<EqualizacaoResponseDto> {
    // Check if equalizacao already exists for this user and cycle
    const existingEqualizacao =
      await this.equalizacaoRepository.findByUserAndCycle(
        createEqualizacaoDto.idAvaliado,
        createEqualizacaoDto.idCiclo
      );

    if (existingEqualizacao) {
      throw new ConflictException(
        `Equalizacao already exists for user ${createEqualizacaoDto.idAvaliado} in cycle ${createEqualizacaoDto.idCiclo}`
      );
    }

    const stats = await this.usersService.getUserStatistics(
      createEqualizacaoDto.idAvaliado,
      createEqualizacaoDto.idCiclo
    );

    const mediaAutoavaliacaoEncrypted = await this.cryptoService.encrypt(
      (stats?.autoavaliacaoAverage || 0).toString()
    );
    const mediaAvaliacaoGestorEncrypted = await this.cryptoService.encrypt(
      (stats?.avaliacaoGestorAvg || 0).toString()
    );
    const mediaAvaliacao360Encrypted = await this.cryptoService.encrypt(
      (stats?.avaliacao360Avg || 0).toString()
    );
    const notaFinalEncrypted = await this.cryptoService.encrypt(
      createEqualizacaoDto.notaFinal.toString()
    );

    return await this.equalizacaoRepository.createEqualizacao(
      createEqualizacaoDto,
      mediaAutoavaliacaoEncrypted,
      mediaAvaliacaoGestorEncrypted,
      mediaAvaliacao360Encrypted,
      notaFinalEncrypted
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
          notaAutoavaliacao:
            parseFloat(existingEqualizacao.mediaAutoavaliacao) || 0,
          notaGestor: parseFloat(existingEqualizacao.mediaAvaliacaoGestor) || 0,
          notaAvaliacao360:
            parseFloat(existingEqualizacao.mediaAvaliacao360) || 0,
          notaFinal: parseFloat(existingEqualizacao.notaFinal) || 0,
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
}
