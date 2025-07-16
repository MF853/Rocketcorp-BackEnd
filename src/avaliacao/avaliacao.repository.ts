import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Autoavaliacao, Avaliacao360, Prisma } from "@prisma/client";
import {
  CreateAvaliacaoDto,
  CreateAvaliacao360Dto,
  CreateMentoringDto,
} from "./dto/create-avaliacao.dto";
import {
  UpdateAvaliacaoDto,
  UpdateAvaliacao360Dto,
} from "./dto/update-avaliacao.dto";

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

export type AutoavaliacaoWithIncludes = Autoavaliacao & {
  criterio: { id: number; name: string; enabled: boolean } | null;
  user: { id: number; name: string; email: string };
};

export type Avaliacao360WithIncludes = Avaliacao360 & {
  avaliador: { id: number; name: string; email: string };
  avaliado: { id: number; name: string; email: string };
};

@Injectable()
export class AvaliacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAvaliacao(data: EncryptedCreateAvaliacaoDto) {
    const { idUser, idCiclo, criterioId, ...rest } = data;
    return this.prisma.autoavaliacao.create({
      data: {
        ...rest,
        user: { connect: { id: idUser } },
        ciclo: { connect: { id: idCiclo } },
        criterio: { connect: { id: criterioId } },
      },
      include: {
        criterio: { select: { id: true, name: true, enabled: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAllAvaliacoes(filters?: {
    idUser?: number;
    idCiclo?: number;
    criterioId?: number;
  }) {
    return this.prisma.autoavaliacao.findMany({
      where: filters,
      include: this.getAvaliacaoIncludes(),
      orderBy: { createdAt: "desc" },
    });
  }

  async findAvaliacaoById(id: number) {
    return this.prisma.autoavaliacao.findUnique({
      where: { id },
      include: this.getAvaliacaoIncludes(),
    });
  }

  async updateAvaliacao(id: number, data: EncryptedUpdateAvaliacaoDto) {
    const { idUser, idCiclo, criterioId, ...rest } = data;

    const updateData: Prisma.AutoavaliacaoUpdateInput = { ...rest };

    if (idUser) {
      updateData.user = { connect: { id: idUser } };
    }
    if (idCiclo) {
      updateData.ciclo = { connect: { id: idCiclo } };
    }
    if (criterioId) {
      updateData.criterio = { connect: { id: criterioId } };
    }

    return this.prisma.autoavaliacao.update({
      where: { id },
      data: updateData,
      include: this.getAvaliacaoIncludes(),
    });
  }

  async deleteAvaliacao(id: number) {
    return this.prisma.autoavaliacao.delete({
      where: { id },
    });
  }

  async findAvaliacoesByUser(idUser: number) {
    return this.prisma.autoavaliacao.findMany({
      where: { idUser },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        criterio: {
          select: { id: true, name: true, enabled: true, tipo: true },
        },
        ciclo: {
          select: { name: true, year: true, period: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAvaliacoesByAvaliador(idUser: number) {
    return this.prisma.autoavaliacao.findMany({
      where: { idUser },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        criterio: {
          select: { id: true, name: true, enabled: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAvaliacoesByAvaliado(idUser: number) {
    return this.prisma.autoavaliacao.findMany({
      where: { idUser },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        criterio: {
          select: { id: true, name: true, enabled: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAvaliacoesByCiclo(idCiclo: number) {
    return this.prisma.autoavaliacao.findMany({
      where: { idCiclo },
      include: this.getAvaliacaoIncludes(),
      orderBy: { createdAt: "desc" },
    });
  }

  async avaliacaoExists(idUser: number, idCiclo: number, criterioId: number) {
    const count = await this.prisma.autoavaliacao.count({
      where: {
        idUser,
        idCiclo,
        criterioId,
      },
    });
    return count > 0;
  }

  async createAvaliacao360(data: EncryptedCreateAvaliacao360Dto) {
    const { idAvaliador, idAvaliado, idCiclo, ...rest } = data;
    return this.prisma.avaliacao360.create({
      data: {
        ...rest,
        avaliador: { connect: { id: idAvaliador } },
        avaliado: { connect: { id: idAvaliado } },
        ciclo: { connect: { id: idCiclo } },
      },
      include: this.getAvaliacao360Includes(),
    });
  }

  async findAllAvaliacoes360(filters?: {
    idAvaliador?: number;
    idAvaliado?: number;
    idCiclo?: number;
  }) {
    return this.prisma.avaliacao360.findMany({
      where: filters,
      include: this.getAvaliacao360Includes(),
      orderBy: { createdAt: "desc" },
    });
  }

  async findAvaliacao360ById(id: number) {
    return this.prisma.avaliacao360.findUnique({
      where: { id },
      include: this.getAvaliacao360Includes(),
    });
  }

  async updateAvaliacao360(id: number, data: EncryptedUpdateAvaliacao360Dto) {
    const { idAvaliador, idAvaliado, idCiclo, ...rest } = data;

    const updateData: Prisma.Avaliacao360UpdateInput = { ...rest };

    if (idAvaliador) {
      updateData.avaliador = { connect: { id: idAvaliador } };
    }
    if (idAvaliado) {
      updateData.avaliado = { connect: { id: idAvaliado } };
    }
    if (idCiclo) {
      updateData.ciclo = { connect: { id: idCiclo } };
    }

    return this.prisma.avaliacao360.update({
      where: { id },
      data: updateData,
      include: this.getAvaliacao360Includes(),
    });
  }

  async deleteAvaliacao360(id: number) {
    return this.prisma.avaliacao360.delete({
      where: { id },
    });
  }

  async findAvaliacoes360ByAvaliador(idAvaliador: number) {
    return this.prisma.avaliacao360.findMany({
      where: { idAvaliador },
      include: {
        avaliado: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAvaliacoes360ByAvaliado(idAvaliado: number) {
    return this.prisma.avaliacao360.findMany({
      where: { idAvaliado },
      include: {
        avaliador: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAvaliacoes360ByCiclo(idCiclo: number) {
    return this.prisma.avaliacao360.findMany({
      where: { idCiclo },
      include: this.getAvaliacao360Includes(),
      orderBy: { createdAt: "desc" },
    });
  }

  async avaliacao360Exists(
    idAvaliador: number,
    idAvaliado: number,
    idCiclo: number
  ) {
    const count = await this.prisma.avaliacao360.count({
      where: {
        idAvaliador,
        idAvaliado,
        idCiclo,
      },
    });
    return count > 0;
  }
  async getCycleStatistics(idCiclo: number) {
    const [totalAutoavaliacoes, totalAvaliacoes360] = await Promise.all([
      this.prisma.autoavaliacao.count({ where: { idCiclo } }),
      this.prisma.avaliacao360.count({ where: { idCiclo } }),
    ]);

    return {
      totalAutoavaliacoes,
      totalAvaliacoes360,
      avgNota: 0, // Cannot calculate average on encrypted fields
      avgNota360: 0, // Cannot calculate average on encrypted fields
    };
  }

  async getUserPerformanceSummary(userId: number, idCiclo?: number) {
    const whereClause = idCiclo
      ? { idUser: userId, idCiclo }
      : { idUser: userId };

    const [avaliacoesRecebidas, avaliacoes360Recebidas] = await Promise.all([
      this.prisma.autoavaliacao.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, name: true } },
          criterio: { select: { id: true, name: true } },
        },
      }),
      this.prisma.avaliacao360.findMany({
        where: whereClause,
        include: {
          avaliador: { select: { id: true, name: true } },
        },
      }),
    ]);

    return {
      avaliacoesRecebidas,
      avaliacoes360Recebidas,
      totalAvaliacoes: avaliacoesRecebidas.length,
      totalAvaliacoes360: avaliacoes360Recebidas.length,
    };
  }

  // ==================== MENTORING METHODS ====================

  /**
   * Verifica se já existe uma avaliação de mentoring para os parâmetros fornecidos
   */
  async mentoringExists(
    idMentor: number,
    idMentorado: number,
    idCiclo: number
  ): Promise<boolean> {
    try {
      const count = await this.prisma.mentoring.count({
        where: { idMentor, idMentorado, idCiclo },
      });
      return count > 0;
    } catch (error) {
      console.error("Erro ao verificar existência de mentoring:", error);
      return false;
    }
  }

  /**
   * Cria uma nova avaliação de mentoring
   */
  async createMentoring(createMentoringDto: EncryptedCreateMentoringDto) {
    const { idMentor, idMentorado, idCiclo, ...rest } = createMentoringDto;
    try {
      return await this.prisma.mentoring.create({
        data: {
          ...rest,
          mentor: { connect: { id: idMentor } },
          mentorado: { connect: { id: idMentorado } },
          ciclo: { connect: { id: idCiclo } },
        },
      });
    } catch (error) {
      console.error("Erro ao criar mentoring:", error);
      throw error;
    }
  }

  /**
   * Cria múltiplas avaliações de mentoring em lote
   */
  async createBulkMentoring(mentoringData: EncryptedCreateMentoringDto[]) {
    try {
      console.log("📝 Criando mentoring em lote:", mentoringData);

      const data = mentoringData.map((item) => {
        const { idMentor, idMentorado, idCiclo, ...rest } = item;
        return {
          ...rest,
          idMentor,
          idMentorado,
          idCiclo,
        };
      });

      // Opção 1: Usar createMany (mais eficiente)
      const result = await this.prisma.mentoring.createMany({
        data: data,
        skipDuplicates: false, // ou true se quiser pular duplicatas
      });

      console.log("✅ Mentorings criados:", result.count);

      // Se precisar retornar os dados criados, busque-os
      const createdMentorings = await this.prisma.mentoring.findMany({
        where: {
          OR: mentoringData.map((item) => ({
            idMentor: item.idMentor,
            idMentorado: item.idMentorado,
            idCiclo: item.idCiclo,
          })),
        },
        orderBy: { createdAt: "desc" },
        take: mentoringData.length,
      });

      return createdMentorings;
    } catch (error) {
      console.error("Erro ao criar mentorings em lote:", error);
      throw error;
    }
  }

  /**
   * Busca todas as avaliações de mentoring
   */
  async findAllMentoring() {
    try {
      return await this.prisma.mentoring.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Erro ao buscar todos os mentorings:", error);
      throw error;
    }
  }

  /**
   * Busca uma avaliação de mentoring por ID
   */
  async findMentoringById(id: number) {
    try {
      return await this.prisma.mentoring.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("Erro ao buscar mentoring por ID:", error);
      throw error;
    }
  }

  /**
   * Atualiza uma avaliação de mentoring
   */
  async updateMentoring(
    id: number,
    updateData: Partial<EncryptedCreateMentoringDto>
  ) {
    const { idMentor, idMentorado, idCiclo, ...rest } = updateData;

    const data: Prisma.MentoringUpdateInput = { ...rest };

    if (idMentor) {
      data.mentor = { connect: { id: idMentor } };
    }
    if (idMentorado) {
      data.mentorado = { connect: { id: idMentorado } };
    }
    if (idCiclo) {
      data.ciclo = { connect: { id: idCiclo } };
    }

    try {
      return await this.prisma.mentoring.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("Erro ao atualizar mentoring:", error);
      throw error;
    }
  }

  /**
   * Remove uma avaliação de mentoring
   */
  async deleteMentoring(id: number): Promise<boolean> {
    try {
      await this.prisma.mentoring.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Erro ao deletar mentoring:", error);
      return false;
    }
  }

  /**
   * Busca avaliações de mentoring por mentor
   */
  async findMentoringByMentor(idMentor: number) {
    try {
      return await this.prisma.mentoring.findMany({
        where: { idMentor },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Erro ao buscar mentorings por mentor:", error);
      throw error;
    }
  }

  /**
   * Busca avaliações de mentoring por mentorado
   */
  async findMentoringByMentorado(idMentorado: number) {
    try {
      return await this.prisma.mentoring.findMany({
        where: { idMentorado },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Erro ao buscar mentorings por mentorado:", error);
      throw error;
    }
  }

  /**
   * Busca avaliações de mentoring por ciclo
   */
  async findMentoringByCiclo(idCiclo: number) {
    try {
      return await this.prisma.mentoring.findMany({
        where: { idCiclo },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Erro ao buscar mentorings por ciclo:", error);
      throw error;
    }
  }

  // ==================== EXISTING METHODS ====================

  /**
   * Creates multiple Avaliacoes in a single transaction
   */
  async createBulkAvaliacoes(
    avaliacoes: EncryptedCreateAvaliacaoDto[]
  ): Promise<AutoavaliacaoWithIncludes[]> {
    return this.prisma.$transaction(async (tx) => {
      const createdAvaliacoes: AutoavaliacaoWithIncludes[] = [];

      for (const avaliacao of avaliacoes) {
        const { idUser, idCiclo, criterioId, ...rest } = avaliacao;

        // Check if autoavaliacao already exists for this user, cycle, and criterion
        const existingAvaliacao = await tx.autoavaliacao.findUnique({
          where: {
            idUser_idCiclo_criterioId: {
              idUser: idUser,
              idCiclo: idCiclo,
              criterioId: criterioId,
            },
          },
        });

        if (existingAvaliacao) {
          // Update existing autoavaliacao
          const result = await tx.autoavaliacao.update({
            where: { id: existingAvaliacao.id },
            data: rest,
          });
          createdAvaliacoes.push(result as AutoavaliacaoWithIncludes);
        } else {
          // Create new autoavaliacao
          const result = await tx.autoavaliacao.create({
            data: {
              ...rest,
              user: { connect: { id: idUser } },
              ciclo: { connect: { id: idCiclo } },
              criterio: { connect: { id: criterioId } },
            },
          });
          createdAvaliacoes.push(result as AutoavaliacaoWithIncludes);
        }
      }

      return createdAvaliacoes;
    });
  }

  /**
   * Creates multiple Avaliacoes360 in a single transaction
   */
  async createBulkAvaliacoes360(
    avaliacoes360: EncryptedCreateAvaliacao360Dto[]
  ): Promise<Avaliacao360WithIncludes[]> {
    return this.prisma.$transaction(async (tx) => {
      const createdAvaliacoes360: Avaliacao360WithIncludes[] = [];

      for (const avaliacao360 of avaliacoes360) {
        const { idAvaliador, idAvaliado, idCiclo, ...rest } = avaliacao360;
        const created = await tx.avaliacao360.create({
          data: {
            ...rest,
            avaliador: { connect: { id: idAvaliador } },
            avaliado: { connect: { id: idAvaliado } },
            ciclo: { connect: { id: idCiclo } },
          },
        });
        createdAvaliacoes360.push(created as Avaliacao360WithIncludes);
      }

      return createdAvaliacoes360;
    });
  }

  /**
   * Creates a mix of Avaliacoes and Avaliacoes360 in a single transaction
   */
  async createBulkMixed(data: {
    autoavaliacoes?: EncryptedCreateAvaliacaoDto[];
    avaliacoes360?: EncryptedCreateAvaliacao360Dto[];
  }): Promise<{
    autoavaliacoes: AutoavaliacaoWithIncludes[];
    avaliacoes360: Avaliacao360WithIncludes[];
  }> {
    return this.prisma.$transaction(async (tx) => {
      const results = {
        autoavaliacoes: [] as AutoavaliacaoWithIncludes[],
        avaliacoes360: [] as Avaliacao360WithIncludes[],
      };

      // Create regular evaluations
      if (data.autoavaliacoes && data.autoavaliacoes.length > 0) {
        for (const avaliacao of data.autoavaliacoes) {
          const { idUser, idCiclo, criterioId, ...rest } = avaliacao;

          // Check if autoavaliacao already exists for this user, cycle, and criterion
          const existingAvaliacao = await tx.autoavaliacao.findUnique({
            where: {
              idUser_idCiclo_criterioId: {
                idUser: idUser,
                idCiclo: idCiclo,
                criterioId: criterioId,
              },
            },
          });

          if (existingAvaliacao) {
            // Update existing autoavaliacao
            const result = await tx.autoavaliacao.update({
              where: { id: existingAvaliacao.id },
              data: rest,
            });
            results.autoavaliacoes.push(result as AutoavaliacaoWithIncludes);
          } else {
            // Create new autoavaliacao
            const result = await tx.autoavaliacao.create({
              data: {
                ...rest,
                user: { connect: { id: idUser } },
                ciclo: { connect: { id: idCiclo } },
                criterio: { connect: { id: criterioId } },
              },
            });
            results.autoavaliacoes.push(result as AutoavaliacaoWithIncludes);
          }
        }
      }

      if (data.avaliacoes360 && data.avaliacoes360.length > 0) {
        for (const avaliacao360 of data.avaliacoes360) {
          const { idAvaliador, idAvaliado, idCiclo, ...rest } = avaliacao360;
          const created = await tx.avaliacao360.create({
            data: {
              ...rest,
              avaliador: { connect: { id: idAvaliador } },
              avaliado: { connect: { id: idAvaliado } },
              ciclo: { connect: { id: idCiclo } },
            },
          });
          results.avaliacoes360.push(created as Avaliacao360WithIncludes);
        }
      }

      return results;
    });
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private getAvaliacaoIncludes() {
    return {
      criterio: { select: { id: true, name: true, enabled: true } },
      user: { select: { id: true, name: true, email: true, cargo: true } },
    };
  }

  private getAvaliacao360Includes() {
    return {
      avaliador: { select: { id: true, name: true, email: true } },
      avaliado: { select: { id: true, name: true, email: true } },
    };
  }

  // ✅ Método updateNotaGestor
  async updateNotaGestor(
    id: number,
    notaGestor: number,
    justificativaGestor?: string
  ) {
    // Convert number to string for encrypted storage
    const encryptedNotaGestor = notaGestor.toString();

    return await this.prisma.autoavaliacao.update({
      where: { id },
      data: {
        notaGestor: encryptedNotaGestor,
        ...(justificativaGestor !== undefined && { justificativaGestor }),
      },
      include: {
        criterio: { select: { id: true, name: true, enabled: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  // ✅ Método createBulk que o service está chamando
  async createBulk(data: {
    autoavaliacoes?: EncryptedCreateAvaliacaoDto[];
    avaliacoes360?: EncryptedCreateAvaliacao360Dto[];
  }) {
    return this.createBulkMixed(data);
  }

  async findAvaliacoesByGestorCiclo(gestorId: number, idCiclo: number) {
    return this.prisma.autoavaliacao.findMany({
      where: {
        idCiclo,
        user: {
          gestorId: gestorId,
        },
      },
      include: this.getAvaliacaoIncludes(),
      orderBy: { createdAt: "desc" },
    });
  }
}
