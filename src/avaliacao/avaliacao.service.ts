import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { AvaliacaoRepository } from "./avaliacao.repository";
import {
  CreateAvaliacaoDto,
  CreateAvaliacao360Dto,
} from "./dto/create-avaliacao.dto";
import {
  UpdateAvaliacaoDto,
  UpdateAvaliacao360Dto,
} from "./dto/update-avaliacao.dto";

@Injectable()
export class AvaliacaoService {
  constructor(private readonly avaliacaoRepository: AvaliacaoRepository) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto) {
    const exists = await this.avaliacaoRepository.avaliacaoExists(
      createAvaliacaoDto.idAvaliador,
      createAvaliacaoDto.idAvaliado,
      createAvaliacaoDto.idCiclo,
      createAvaliacaoDto.criterioId
    );

    if (exists) {
      throw new ConflictException(
        "Já existe uma avaliação para este avaliador, avaliado, ciclo e critério"
      );
    }

    return this.avaliacaoRepository.createAvaliacao(createAvaliacaoDto);
  }

  async create360(createAvaliacao360Dto: CreateAvaliacao360Dto) {
    const exists = await this.avaliacaoRepository.avaliacao360Exists(
      createAvaliacao360Dto.idAvaliador,
      createAvaliacao360Dto.idAvaliado,
      createAvaliacao360Dto.idCiclo
    );

    if (exists) {
      throw new ConflictException(
        "Já existe uma avaliação 360 para este avaliador, avaliado e ciclo"
      );
    }

    return this.avaliacaoRepository.createAvaliacao360(createAvaliacao360Dto);
  }

  findAll() {
    return this.avaliacaoRepository.findAllAvaliacoes();
  }

  findAll360() {
    return this.avaliacaoRepository.findAllAvaliacoes360();
  }

  async findOne(id: number) {
    const avaliacao = await this.avaliacaoRepository.findAvaliacaoById(id);

    if (!avaliacao) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada`);
    }

    return avaliacao;
  }

  async findOne360(id: number) {
    const avaliacao360 = await this.avaliacaoRepository.findAvaliacao360ById(
      id
    );

    if (!avaliacao360) {
      throw new NotFoundException(`Avaliação 360 com ID ${id} não encontrada`);
    }

    return avaliacao360;
  }

  async update(id: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    await this.findOne(id);
    return this.avaliacaoRepository.updateAvaliacao(id, updateAvaliacaoDto);
  }

  async update360(id: number, updateAvaliacao360Dto: UpdateAvaliacao360Dto) {
    await this.findOne360(id); // Verifica se existe
    return this.avaliacaoRepository.updateAvaliacao360(
      id,
      updateAvaliacao360Dto
    );
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.avaliacaoRepository.deleteAvaliacao(id);
  }

  async remove360(id: number) {
    await this.findOne360(id);
    return this.avaliacaoRepository.deleteAvaliacao360(id);
  }

  findByAvaliador(idAvaliador: number) {
    return this.avaliacaoRepository.findAvaliacoesByAvaliador(idAvaliador);
  }

  findByAvaliado(idAvaliado: number) {
    return this.avaliacaoRepository.findAvaliacoesByAvaliado(idAvaliado);
  }

  findByCiclo(idCiclo: number) {
    return this.avaliacaoRepository.findAvaliacoesByCiclo(idCiclo);
  }

  findAvaliacoes360ByAvaliador(idAvaliador: number) {
    return this.avaliacaoRepository.findAvaliacoes360ByAvaliador(idAvaliador);
  }

  findAvaliacoes360ByAvaliado(idAvaliado: number) {
    return this.avaliacaoRepository.findAvaliacoes360ByAvaliado(idAvaliado);
  }

  findAvaliacoes360ByCiclo(idCiclo: number) {
    return this.avaliacaoRepository.findAvaliacoes360ByCiclo(idCiclo);
  }

  getCycleStatistics(idCiclo: number) {
    return this.avaliacaoRepository.getCycleStatistics(idCiclo);
  }

  getUserPerformanceSummary(userId: number, idCiclo?: number) {
    return this.avaliacaoRepository.getUserPerformanceSummary(userId, idCiclo);
  }
}
