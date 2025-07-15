import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
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
export class AvaliacaoRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createAvaliacao(data: CreateAvaliacaoDto) {
    return this.prisma.autoavaliacao.create({
      data,
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

  async updateAvaliacao(id: number, data: UpdateAvaliacaoDto) {
    return this.prisma.autoavaliacao.update({
      where: { id },
      data,
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
          select: { id: true, name: true, enabled: true },
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

  async avaliacaoExists(
    idUser: number,
    idCiclo: number,
    criterioId: number
  ) {
    const count = await this.prisma.autoavaliacao.count({
      where: {
        idUser,
        idCiclo,
        criterioId,
      },
    });
    return count > 0;
  }

  async createAvaliacao360(data: CreateAvaliacao360Dto) {
    return this.prisma.avaliacao360.create({
      data,
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

  async updateAvaliacao360(id: number, data: UpdateAvaliacao360Dto) {
    return this.prisma.avaliacao360.update({
      where: { id },
      data,
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
    const [totalAutoavaliacoes, totalAvaliacoes360, avgNota, avgNota360] =
      await Promise.all([
        this.prisma.autoavaliacao.count({ where: { idCiclo } }),
        this.prisma.avaliacao360.count({ where: { idCiclo } }),
        this.prisma.autoavaliacao.aggregate({
          where: { idCiclo, nota: { not: null } },
          _avg: { nota: true },
        }),
        this.prisma.avaliacao360.aggregate({
          where: { idCiclo, nota: { not: null } },
          _avg: { nota: true },
        }),
      ]);

    return {
      totalAutoavaliacoes,
      totalAvaliacoes360,
      avgNota: (avgNota._avg.nota as number) || 0,
      avgNota360: (avgNota360._avg.nota as number) || 0,
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
  async createMentoring(createMentoringDto: CreateMentoringDto) {
    try {
      return await this.prisma.mentoring.create({
        data: createMentoringDto,
      });
    } catch (error) {
      console.error("Erro ao criar mentoring:", error);
      throw error;
    }
  }

  /**
   * Cria múltiplas avaliações de mentoring em lote
   */
  async createBulkMentoring(mentoringData: CreateMentoringDto[]) {
    try {
      console.log("📝 Criando mentoring em lote:", mentoringData);

      // Opção 1: Usar createMany (mais eficiente)
      const result = await this.prisma.mentoring.createMany({
        data: mentoringData,
        skipDuplicates: false, // ou true se quiser pular duplicatas
      });

      console.log("✅ Mentorings criados:", result.count);

      // Se precisar retornar os dados criados, busque-os
      const createdMentorings = await this.prisma.mentoring.findMany({
        where: {
          OR: mentoringData.map(item => ({
            idMentor: item.idMentor,
            idMentorado: item.idMentorado,
            idCiclo: item.idCiclo,
          }))
        },
        orderBy: { createdAt: 'desc' },
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
  async updateMentoring(id: number, updateData: Partial<CreateMentoringDto>) {
    try {
      return await this.prisma.mentoring.update({
        where: { id },
        data: updateData,
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
  async createBulkAvaliacoes(avaliacoes: CreateAvaliacaoDto[]): Promise<any[]> {
    return this.prisma.$transaction(async (tx) => {
      const createdAvaliacoes: any[] = [];

      for (const avaliacao of avaliacoes) {
        // Check if autoavaliacao already exists for this user, cycle, and criterion
        const existingAvaliacao = await tx.autoavaliacao.findUnique({
          where: {
            idUser_idCiclo_criterioId: {
              idUser: avaliacao.idUser,
              idCiclo: avaliacao.idCiclo,
              criterioId: avaliacao.criterioId,
            },
          },
        });

        if (existingAvaliacao) {
          // Update existing autoavaliacao
          const result = await tx.autoavaliacao.update({
            where: { id: existingAvaliacao.id },
            data: avaliacao,
            include: {
              criterio: { select: { id: true, name: true, enabled: true } },
              user: { select: { id: true, name: true, email: true } },
            },
          });
          createdAvaliacoes.push(result);
        } else {
          // Create new autoavaliacao
          const result = await tx.autoavaliacao.create({
            data: avaliacao,
            include: {
              criterio: { select: { id: true, name: true, enabled: true } },
              user: { select: { id: true, name: true, email: true } },
            },
          });
          createdAvaliacoes.push(result);
        }
      }

      return createdAvaliacoes;
    });
  }

  /**
   * Creates multiple Avaliacoes360 in a single transaction
   */
  async createBulkAvaliacoes360(avaliacoes360: CreateAvaliacao360Dto[]): Promise<any[]> {
    return this.prisma.$transaction(async (tx) => {
      const createdAvaliacoes360: any[] = [];

      for (const avaliacao360 of avaliacoes360) {
        const created = await tx.avaliacao360.create({
          data: avaliacao360,
          include: {
            avaliador: { select: { id: true, name: true, email: true } },
            avaliado: { select: { id: true, name: true, email: true } },
          },
        });
        createdAvaliacoes360.push(created);
      }

      return createdAvaliacoes360;
    });
  }

  /**
   * Creates a mix of Avaliacoes and Avaliacoes360 in a single transaction
   */
  async createBulkMixed(data: {
    autoavaliacoes?: CreateAvaliacaoDto[];
    avaliacoes360?: CreateAvaliacao360Dto[];
  }): Promise<{ autoavaliacoes: any[]; avaliacoes360: any[] }> {
    return this.prisma.$transaction(async (tx) => {
      const results = {
        autoavaliacoes: [] as any[],
        avaliacoes360: [] as any[],
      };

      // Create regular evaluations
      if (data.autoavaliacoes && data.autoavaliacoes.length > 0) {
        for (const avaliacao of data.autoavaliacoes) {
          // Check if autoavaliacao already exists for this user, cycle, and criterion
          const existingAvaliacao = await tx.autoavaliacao.findUnique({
            where: {
              idUser_idCiclo_criterioId: {
                idUser: avaliacao.idUser,
                idCiclo: avaliacao.idCiclo,
                criterioId: avaliacao.criterioId,
              },
            },
          });

          if (existingAvaliacao) {
            // Update existing autoavaliacao
            const result = await tx.autoavaliacao.update({
              where: { id: existingAvaliacao.id },
              data: avaliacao,
              include: {
                criterio: { select: { id: true, name: true, enabled: true } },
                user: { select: { id: true, name: true, email: true } },
              },
            });
            results.autoavaliacoes.push(result);
          } else {
            // Create new autoavaliacao
            const result = await tx.autoavaliacao.create({
              data: avaliacao,
              include: {
                criterio: { select: { id: true, name: true, enabled: true } },
                user: { select: { id: true, name: true, email: true } },
              },
            });
            results.autoavaliacoes.push(result);
          }
        }
      }

      if (data.avaliacoes360 && data.avaliacoes360.length > 0) {
        for (const avaliacao360 of data.avaliacoes360) {
          const created = await tx.avaliacao360.create({
            data: avaliacao360,
            include: {
              avaliador: { select: { id: true, name: true, email: true } },
              avaliado: { select: { id: true, name: true, email: true } },
            },
          });
          results.avaliacoes360.push(created);
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
  async updateNotaGestor(id: number, notaGestor: number, justificativa?: string) {
    return await this.prisma.autoavaliacao.update({
      where: { id },
      data: {
        notaGestor,
        ...(justificativa && { justificativa }),
      },
      include: {
        criterio: { select: { id: true, name: true, enabled: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  // ✅ Método createBulk que o service está chamando
  async createBulk(data: BulkCreateAvaliacaoDto) {
    return this.createBulkMixed(data);
  }
}
