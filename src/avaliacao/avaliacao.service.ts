import {
  Injectable,
  NotFoundException,
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
import { CryptoService } from "../crypto/crypto.service";
import {
  AutoavaliacaoWithIncludes,
  Avaliacao360WithIncludes,
} from "./avaliacao.repository";
import { Mentoring } from "@prisma/client";

// Type for encrypted data where numeric fields become strings
type EncryptedCreateAvaliacaoDto = Omit<
  CreateAvaliacaoDto,
  "nota" | "notaGestor"
> & {
  nota: string;
  notaGestor?: string;
};

type EncryptedUpdateAvaliacaoDto = Omit<
  UpdateAvaliacaoDto,
  "nota" | "notaGestor"
> & {
  nota?: string;
  notaGestor?: string;
};

type EncryptedCreateAvaliacao360Dto = Omit<CreateAvaliacao360Dto, "nota"> & {
  nota: string;
};

type EncryptedUpdateAvaliacao360Dto = Omit<UpdateAvaliacao360Dto, "nota"> & {
  nota?: string;
};

type EncryptedCreateMentoringDto = Omit<CreateMentoringDto, "nota"> & {
  nota: string;
};

@Injectable()
export class AvaliacaoService {
  constructor(
    private readonly avaliacaoRepository: AvaliacaoRepository,
    private readonly cryptoService: CryptoService
  ) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto) {
    if (createAvaliacaoDto.criterioId !== undefined) {
      const exists = await this.avaliacaoRepository.avaliacaoExists(
        createAvaliacaoDto.idUser,
        createAvaliacaoDto.idCiclo,
        createAvaliacaoDto.criterioId
      );

      if (exists) {
        console.warn(
          `Auto Avaliação já existe: O usuário ${createAvaliacaoDto.idUser} já avaliou o critério ${createAvaliacaoDto.criterioId} no ciclo.`
        );
        return null;
      }
    }

    // Encrypt justificativa fields before saving
    const encryptedDto = await this.cryptoService.encryptObject(
      createAvaliacaoDto
    );

    return this.avaliacaoRepository.createAvaliacao(
      encryptedDto as unknown as EncryptedCreateAvaliacaoDto
    );
  }

  async create360(createAvaliacao360Dto: CreateAvaliacao360Dto) {
    const exists = await this.avaliacaoRepository.avaliacao360Exists(
      createAvaliacao360Dto.idAvaliador,
      createAvaliacao360Dto.idAvaliado,
      createAvaliacao360Dto.idCiclo
    );

    if (exists) {
      console.warn(
        `Avaliação 360 já existe: O usuário ${createAvaliacao360Dto.idAvaliador} já fez uma referência para o usuário ${createAvaliacao360Dto.idAvaliado} no ciclo.`
      );
      return null;
    }

    // Encrypt justificativa fields before saving
    const encryptedDto = await this.cryptoService.encryptObject(
      createAvaliacao360Dto
    );

    return this.avaliacaoRepository.createAvaliacao360(
      encryptedDto as unknown as EncryptedCreateAvaliacao360Dto
    );
  }

  async createMentoring(createMentoringDto: CreateMentoringDto) {
    const exists = await this.avaliacaoRepository.mentoringExists(
      createMentoringDto.idMentor,
      createMentoringDto.idMentorado,
      createMentoringDto.idCiclo
    );

    if (exists) {
      console.warn(
        `Mentoring já existe: O mentor ${createMentoringDto.idMentor} já fez uma avaliação para o mentorado ${createMentoringDto.idMentorado} no ciclo ${createMentoringDto.idCiclo}.`
      );
      return null;
    }

    // Encrypt justificativa fields before saving
    const encryptedDto = await this.cryptoService.encryptObject(
      createMentoringDto
    );

    return this.avaliacaoRepository.createMentoring(
      encryptedDto as unknown as EncryptedCreateMentoringDto
    );
  }

  /**
   * Creates multiple Avaliacoes, Avaliacoes360 and Mentoring in bulk
   */
  async createBulk(bulkCreateDto: BulkCreateAvaliacaoDto): Promise<any> {
    console.log(
      "📦 Dados recebidos no bulk:",
      JSON.stringify(bulkCreateDto, null, 2)
    );

    const results = {
      autoavaliacoes: [] as AutoavaliacaoWithIncludes[],
      avaliacoes360: [] as Avaliacao360WithIncludes[],
      mentoring: [] as Mentoring[],
    };

    // ✅ Processar autoavaliações
    if (
      bulkCreateDto.autoavaliacoes &&
      bulkCreateDto.autoavaliacoes.length > 0
    ) {
      console.log("🔄 Processando autoavaliações...");

      for (const item of bulkCreateDto.autoavaliacoes) {
        const exists = await this.avaliacaoRepository.avaliacaoExists(
          item.idUser,
          item.idCiclo,
          item.criterioId
        );

        if (exists) {
          throw new BadRequestException(
            `Já existe uma autoavaliação para usuário ${item.idUser}, ciclo ${item.idCiclo} e critério ${item.criterioId}`
          );
        }
      }

      const autoavaliacoes =
        await this.avaliacaoRepository.createBulkAvaliacoes(
          (await Promise.all(
            bulkCreateDto.autoavaliacoes.map((item) =>
              this.cryptoService.encryptObject(item)
            )
          )) as unknown as EncryptedCreateAvaliacaoDto[]
        );
      results.autoavaliacoes = autoavaliacoes;
      console.log("✅ Autoavaliações criadas:", autoavaliacoes.length);
    }

    // ✅ Processar avaliações 360
    if (bulkCreateDto.avaliacoes360 && bulkCreateDto.avaliacoes360.length > 0) {
      console.log("🔄 Processando avaliações 360...");

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

      const avaliacoes360 =
        await this.avaliacaoRepository.createBulkAvaliacoes360(
          (await Promise.all(
            bulkCreateDto.avaliacoes360.map((item) =>
              this.cryptoService.encryptObject(item)
            )
          )) as unknown as EncryptedCreateAvaliacao360Dto[]
        );
      results.avaliacoes360 = avaliacoes360;
      console.log("✅ Avaliações 360 criadas:", avaliacoes360.length);
    }

    // ✅ Processar mentoring
    if (bulkCreateDto.mentoring && bulkCreateDto.mentoring.length > 0) {
      console.log("🔄 Processando mentoring...");

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
        (await Promise.all(
          bulkCreateDto.mentoring.map((item) =>
            this.cryptoService.encryptObject(item)
          )
        )) as unknown as EncryptedCreateMentoringDto[]
      );
      results.mentoring = mentoring;
      console.log("✅ Mentoring criado:", mentoring.length);
    }

    console.log("✅ Resultados do bulk:", {
      autoavaliacoes: results.autoavaliacoes.length,
      avaliacoes360: results.avaliacoes360.length,
      mentoring: results.mentoring.length,
    });

    return results;
  }

  // ==================== QUERY METHODS ====================

  async findAll() {
    const avaliacoes = await this.avaliacaoRepository.findAllAvaliacoes();
    return await Promise.all(
      avaliacoes.map((item) => this.cryptoService.decryptObject(item))
    );
  }

  async findAll360() {
    const avaliacoes360 = await this.avaliacaoRepository.findAllAvaliacoes360();
    return await Promise.all(
      avaliacoes360.map((item) => this.cryptoService.decryptObject(item))
    );
  }

  async findAllMentoring() {
    const mentoring = await this.avaliacaoRepository.findAllMentoring();
    return await Promise.all(
      mentoring.map((item) => this.cryptoService.decryptObject(item))
    );
  }

  async findOne(id: number) {
    const avaliacao = await this.avaliacaoRepository.findAvaliacaoById(id);

    if (!avaliacao) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada`);
    }

    return await this.cryptoService.decryptObject(avaliacao);
  }

  async findOne360(id: number) {
    const avaliacao360 = await this.avaliacaoRepository.findAvaliacao360ById(
      id
    );

    if (!avaliacao360) {
      throw new NotFoundException(`Avaliação 360 com ID ${id} não encontrada`);
    }

    return await this.cryptoService.decryptObject(avaliacao360);
  }

  async findOneMentoring(id: number) {
    const mentoring = await this.avaliacaoRepository.findMentoringById(id);

    if (!mentoring) {
      throw new NotFoundException(`Mentoring com ID ${id} não encontrado`);
    }

    return await this.cryptoService.decryptObject(mentoring);
  }

  async update(id: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    await this.findOne(id);
    const encryptedDto = await this.cryptoService.encryptObject(
      updateAvaliacaoDto
    );
    return this.avaliacaoRepository.updateAvaliacao(
      id,
      encryptedDto as unknown as EncryptedUpdateAvaliacaoDto
    );
  }

  async update360(id: number, updateAvaliacao360Dto: UpdateAvaliacao360Dto) {
    await this.findOne360(id);
    const encryptedDto = await this.cryptoService.encryptObject(
      updateAvaliacao360Dto
    );
    return this.avaliacaoRepository.updateAvaliacao360(
      id,
      encryptedDto as unknown as EncryptedUpdateAvaliacao360Dto
    );
  }

  async updateMentoring(id: number, updateMentoringDto: UpdateAvaliacaoDto) {
    await this.findOneMentoring(id);
    const encryptedDto = await this.cryptoService.encryptObject(
      updateMentoringDto
    );
    return this.avaliacaoRepository.updateMentoring(
      id,
      encryptedDto as unknown as Partial<EncryptedCreateMentoringDto>
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

  async findByUser(idUser: number) {
    const avaliacoes = await this.avaliacaoRepository.findAvaliacoesByUser(
      idUser
    );
    return await Promise.all(
      avaliacoes.map((item) => this.cryptoService.decryptObject(item))
    );
  }

  async findByAvaliador(idAvaliador: number) {
    const avaliacoes = await this.avaliacaoRepository.findAvaliacoesByAvaliador(
      idAvaliador
    );
    return await Promise.all(
      avaliacoes.map((item) => this.cryptoService.decryptObject(item))
    );
  }

  async findByAvaliado(idAvaliado: number) {
    const avaliacoes = await this.avaliacaoRepository.findAvaliacoesByAvaliado(
      idAvaliado
    );
    return await Promise.all(
      avaliacoes.map((item) => this.cryptoService.decryptObject(item))
    );
  }

  async findByCiclo(idCiclo: number) {
    const avaliacoes = await this.avaliacaoRepository.findAvaliacoesByCiclo(
      idCiclo
    );
    return await Promise.all(
      avaliacoes.map((item) => this.cryptoService.decryptObject(item))
    );
  }

  async findAvaliacoes360ByAvaliador(idAvaliador: number) {
    const avaliacoes360 =
      await this.avaliacaoRepository.findAvaliacoes360ByAvaliador(idAvaliador);
    return await Promise.all(
      avaliacoes360.map((item) => this.cryptoService.decryptObject(item))
    );
  }

  async findAvaliacoes360ByAvaliado(idAvaliado: number) {
    const avaliacoes360 =
      await this.avaliacaoRepository.findAvaliacoes360ByAvaliado(idAvaliado);
    return await Promise.all(
      avaliacoes360.map((item) => this.cryptoService.decryptObject(item))
    );
  }

  async findAvaliacoes360ByCiclo(idCiclo: number) {
    const avaliacoes360 =
      await this.avaliacaoRepository.findAvaliacoes360ByCiclo(idCiclo);
    return await Promise.all(
      avaliacoes360.map((item) => this.cryptoService.decryptObject(item))
    );
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

  async getGestorCiclo(gestorId: number, idCiclo: number) {
    const avaliacoes =
      await this.avaliacaoRepository.findAvaliacoesByGestorCiclo(
        gestorId,
        idCiclo
      );
    console.log(
      `📊 Avaliações encontradas para gestor ${gestorId} no ciclo ${idCiclo}:`,
      avaliacoes.length
    );
    for (const a of avaliacoes) {
      console.log(
        `Avaliação: ${a.id}, Avaliado: ${a.user.name}, Nota: ${a.nota}, Nota Gestor: ${a.notaGestor}`
      );
    }

    // Define proper types for the grouped data
    type GroupedUser = {
      id: number;
      name: string;
      cargo: string | null;
      notas: (string | null)[];
      notasGestor: (string | null)[];
    };

    // Group by user
    const grouped = new Map<number, GroupedUser>();
    for (const a of avaliacoes) {
      const userId = a.user.id;
      if (!grouped.has(userId)) {
        grouped.set(userId, {
          id: userId,
          name: a.user.name,
          cargo: a.user.cargo,
          notas: [],
          notasGestor: [],
        });
      }
      const user = grouped.get(userId)!;
      user.notas.push(a.nota);
      user.notasGestor.push(a.notaGestor);
    }

    // Calculate means - convert encrypted strings to numbers for calculation
    return Array.from(grouped.values()).map((u) => ({
      id: u.id,
      name: u.name,
      cargo: u.cargo,
      meanNota: u.notas.includes(null)
        ? null
        : u.notas.reduce(
            (acc, nota) => acc + (nota ? parseFloat(nota) : 0),
            0
          ) / u.notas.length,
      meanNotaGestor: u.notasGestor.includes(null)
        ? null
        : u.notasGestor.reduce(
            (acc, nota) => acc + (nota ? parseFloat(nota) : 0),
            0
          ) / u.notasGestor.length,
    }));
  }

  async getColaboradorCiclo(colaboradorId: number, idCiclo: number) {
    let avaliacoes = await this.avaliacaoRepository.findAvaliacoesByUser(
      colaboradorId
    );
    avaliacoes = avaliacoes.filter((a) => a.idCiclo === idCiclo);

    // Group by criterio.tipo (block)
    const blocksMap = new Map<
      string,
      { id: string; name: string; criteria: any[] }
    >();
    for (const a of avaliacoes) {
      const criterio = a.criterio;
      if (!criterio) continue; // skip if criterio is null
      const tipo = criterio.tipo || "Outro";
      if (!blocksMap.has(tipo)) {
        blocksMap.set(tipo, {
          id: tipo,
          name: tipo,
          criteria: [],
        });
      }
      const block = blocksMap.get(tipo);
      if (block) {
        block.criteria.push({
          id: a.id.toString(),
          name: criterio.name,
          selfScore: a.nota ?? 0,
          selfJustification: a.justificativa ?? "",
          managerScore: a.notaGestor ?? 0,
          managerJustification: a.justificativaGestor ?? "",
        });
      }
    }
    return Array.from(blocksMap.values());
  }

  // Método para atualizar nota do gestor em avaliação existente
  async updateNotaGestor(
    id: number,
    notaGestor: number,
    justificativa?: string
  ) {
    return await this.avaliacaoRepository.updateNotaGestor(
      id,
      notaGestor,
      justificativa
    );
  }

  async patchGestorBulk(body: {
    colaboradorId: number;
    cicloId: number;
    updates: {
      avaliacaoId: number;
      notaGestor: number;
      justificativaGestor?: string;
    }[];
  }) {
    const { colaboradorId, cicloId, updates } = body;
    if (!colaboradorId || !cicloId || !Array.isArray(updates)) {
      throw new BadRequestException(
        "Dados inválidos para atualização em lote."
      );
    }
    let updated = 0;
    const errors: string[] = [];
    for (const u of updates) {
      try {
        // Confirma se a avaliação pertence ao colaborador e ciclo
        const avaliacao = await this.avaliacaoRepository.findAvaliacaoById(
          u.avaliacaoId
        );
        if (
          !avaliacao ||
          avaliacao.idUser !== colaboradorId ||
          avaliacao.idCiclo !== cicloId
        ) {
          errors.push(
            `Avaliação ${u.avaliacaoId} não pertence ao colaborador/ciclo informado.`
          );
          continue;
        }
        await this.avaliacaoRepository.updateNotaGestor(
          u.avaliacaoId,
          u.notaGestor,
          u.justificativaGestor
        );
        updated++;
      } catch (e) {
        errors.push(
          `Erro ao atualizar avaliação ${u.avaliacaoId}: ${
            e instanceof Error ? e.message : "Erro desconhecido"
          }`
        );
      }
    }
    return { updated, errors };
  }
}
