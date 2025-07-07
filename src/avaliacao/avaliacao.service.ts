import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { AvaliacaoRepository } from "./avaliacao.repository";
import {
  CreateAvaliacaoDto,
  CreateAvaliacao360Dto,
  BulkCreateAvaliacaoDto, // ✅ Este é o tipo correto
} from "./dto/create-avaliacao.dto";
import {
  UpdateAvaliacaoDto,
  UpdateAvaliacao360Dto,
} from "./dto/update-avaliacao.dto";

@Injectable()
export class AvaliacaoService {
  constructor(private readonly avaliacaoRepository: AvaliacaoRepository) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto) {
    if (createAvaliacaoDto.criterioId !== undefined) {
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
    }

    return this.avaliacaoRepository.create(createAvaliacaoDto);
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

  /**
   * Creates multiple Avaliacoes and/or Avaliacoes360 in bulk
   */
  async createBulk(bulkCreateDto: BulkCreateAvaliacaoDto) {
    const results = {
      success: true,
      created: {
        avaliacoes: 0,
        avaliacoes360: 0,
      },
      data: {
        avaliacoes: [] as any[],
        avaliacoes360: [] as any[],
      },
      errors: [] as string[],
    };

    try {
      // Validate duplicates for regular evaluations
      if (bulkCreateDto.avaliacoes && bulkCreateDto.avaliacoes.length > 0) {
        for (const avaliacao of bulkCreateDto.avaliacoes) {
          if (avaliacao.criterioId !== undefined) {
            const exists = await this.avaliacaoRepository.avaliacaoExists(
              avaliacao.idAvaliador,
              avaliacao.idAvaliado,
              avaliacao.idCiclo,
              avaliacao.criterioId
            );
            if (exists) {
              results.errors.push(
                `Já existe uma avaliação para avaliador ${avaliacao.idAvaliador}, avaliado ${avaliacao.idAvaliado}, ciclo ${avaliacao.idCiclo} e critério ${avaliacao.criterioId}`
              );
            }
          }
        }
      }

      // Validate duplicates for 360 evaluations
      if (
        bulkCreateDto.avaliacoes360 &&
        bulkCreateDto.avaliacoes360.length > 0
      ) {
        for (const avaliacao360 of bulkCreateDto.avaliacoes360) {
          const exists = await this.avaliacaoRepository.avaliacao360Exists(
            avaliacao360.idAvaliador,
            avaliacao360.idAvaliado,
            avaliacao360.idCiclo
          );
          if (exists) {
            results.errors.push(
              `Já existe uma avaliação 360 para avaliador ${avaliacao360.idAvaliador}, avaliado ${avaliacao360.idAvaliado} e ciclo ${avaliacao360.idCiclo}`
            );
          }
        }
      }

      // If there are validation errors, don't proceed
      if (results.errors.length > 0) {
        results.success = false;
        throw new ConflictException({
          message: "Validation errors found",
          errors: results.errors,
        });
      }

      // Create in bulk using repository transaction
      const createdData = await this.avaliacaoRepository.createBulkMixed({
        avaliacoes: bulkCreateDto.avaliacoes,
        avaliacoes360: bulkCreateDto.avaliacoes360,
      });

      results.data = createdData;
      results.created.avaliacoes = createdData.avaliacoes.length;
      results.created.avaliacoes360 = createdData.avaliacoes360.length;

      return results;
    } catch (error) {
      results.success = false;
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(
        `Failed to create bulk evaluations: ${
          (error as Error).message || "Unknown error"
        }`
      );
    }
  }

  // ==================== QUERY METHODS ====================

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

  // Método para atualizar nota do gestor em avaliação existente
  async updateNotaGestor(id: number, notaGestor: number, justificativa?: string) {
    return await this.avaliacaoRepository.updateNotaGestor(id, notaGestor, justificativa);
  }
}
