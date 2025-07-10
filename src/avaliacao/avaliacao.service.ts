import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { AvaliacaoRepository } from "./avaliacao.repository";
import {
  CreateAvaliacaoDto,
  CreateAvaliacao360Dto,
  CreateMentoringDto,
  BulkCreateAvaliacaoDto,
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

  async createMentoring(createMentoringDto: CreateMentoringDto) {
    const exists = await this.avaliacaoRepository.mentoringExists(
      createMentoringDto.idMentor,
      createMentoringDto.idMentorado,
      createMentoringDto.idCiclo
    );

    if (exists) {
      throw new ConflictException(
        "Já existe uma avaliação de mentoring para este mentor, mentorado e ciclo"
      );
    }

    return this.avaliacaoRepository.createMentoring(createMentoringDto);
  }

  /**
   * Creates multiple Avaliacoes, Avaliacoes360 and Mentoring in bulk
   */
  async createBulk(bulkCreateDto: BulkCreateAvaliacaoDto): Promise<any> {
    console.log('📦 Dados recebidos no bulk:', JSON.stringify(bulkCreateDto, null, 2));
    
    const results = {
      autoavaliacoes: [] as any[],
      avaliacoes360: [] as any[],
      mentoring: [] as any[]
    };

    // ✅ Processar autoavaliações
    if (bulkCreateDto.autoavaliacoes && bulkCreateDto.autoavaliacoes.length > 0) {
      console.log('🔄 Processando autoavaliações...');
      
      for (const item of bulkCreateDto.autoavaliacoes) {
        const exists = await this.avaliacaoRepository.avaliacaoExists(
          item.idAvaliador,
          item.idAvaliado,
          item.idCiclo,
          item.criterioId
        );
        
        if (exists) {
          throw new BadRequestException(
            `Já existe uma autoavaliação para avaliador ${item.idAvaliador}, avaliado ${item.idAvaliado}, ciclo ${item.idCiclo} e critério ${item.criterioId}`
          );
        }
      }

      const autoavaliacoes = await this.avaliacaoRepository.createBulkAvaliacoes(
        bulkCreateDto.autoavaliacoes
      );
      results.autoavaliacoes = autoavaliacoes;
      console.log('✅ Autoavaliações criadas:', autoavaliacoes.length);
    }

    // ✅ Processar avaliações 360
    if (bulkCreateDto.avaliacoes360 && bulkCreateDto.avaliacoes360.length > 0) {
      console.log('🔄 Processando avaliações 360...');
      
      for (const item of bulkCreateDto.avaliacoes360) {
        const exists = await this.avaliacaoRepository.avaliacao360Exists(
          item.idAvaliador,
          item.idAvaliado,
          item.idCiclo
        );
        
        if (exists) {
          throw new BadRequestException(
            `Já existe uma avaliação 360 para avaliador ${item.idAvaliador}, avaliado ${item.idAvaliado} e ciclo ${item.idCiclo}`
          );
        }
      }

      const avaliacoes360 = await this.avaliacaoRepository.createBulkAvaliacoes360(
        bulkCreateDto.avaliacoes360
      );
      results.avaliacoes360 = avaliacoes360;
      console.log('✅ Avaliações 360 criadas:', avaliacoes360.length);
    }

    // ✅ Processar mentoring
    if (bulkCreateDto.mentoring && bulkCreateDto.mentoring.length > 0) {
      console.log('🔄 Processando mentoring...');
      
      for (const item of bulkCreateDto.mentoring) {
        const exists = await this.avaliacaoRepository.mentoringExists(
          item.idMentor,
          item.idMentorado,
          item.idCiclo
        );
        
        if (exists) {
          throw new BadRequestException(
            `Já existe uma avaliação de mentoring para mentor ${item.idMentor}, mentorado ${item.idMentorado} e ciclo ${item.idCiclo}`
          );
        }
      }

      const mentoring = await this.avaliacaoRepository.createBulkMentoring(
        bulkCreateDto.mentoring
      );
      results.mentoring = mentoring;
      console.log('✅ Mentoring criado:', mentoring.length);
    }

    console.log('✅ Resultados do bulk:', {
      autoavaliacoes: results.autoavaliacoes.length,
      avaliacoes360: results.avaliacoes360.length,
      mentoring: results.mentoring.length
    });
    
    return results;
  }

  // ==================== QUERY METHODS ====================

  findAll() {
    return this.avaliacaoRepository.findAllAvaliacoes();
  }

  findAll360() {
    return this.avaliacaoRepository.findAllAvaliacoes360();
  }

  findAllMentoring() {
    return this.avaliacaoRepository.findAllMentoring();
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

  async findOneMentoring(id: number) {
    const mentoring = await this.avaliacaoRepository.findMentoringById(id);

    if (!mentoring) {
      throw new NotFoundException(`Mentoring com ID ${id} não encontrado`);
    }

    return mentoring;
  }

  async update(id: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    await this.findOne(id);
    return this.avaliacaoRepository.updateAvaliacao(id, updateAvaliacaoDto);
  }

  async update360(id: number, updateAvaliacao360Dto: UpdateAvaliacao360Dto) {
    await this.findOne360(id);
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

  async removeMentoring(id: number) {
    await this.findOneMentoring(id);
    return this.avaliacaoRepository.deleteMentoring(id);
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

  findMentoringByMentor(idMentor: number) {
    return this.avaliacaoRepository.findMentoringByMentor(idMentor);
  }

  findMentoringByMentorado(idMentorado: number) {
    return this.avaliacaoRepository.findMentoringByMentorado(idMentorado);
  }

  findMentoringByCiclo(idCiclo: number) {
    return this.avaliacaoRepository.findMentoringByCiclo(idCiclo);
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
