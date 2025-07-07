import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateAvaliacaoDto,
  CreateAvaliacao360Dto,
  BulkCreateAvaliacaoDto, // ✅ Adicionar este import
} from "./dto/create-avaliacao.dto";
import {
  UpdateAvaliacaoDto,
  UpdateAvaliacao360Dto,
} from "./dto/update-avaliacao.dto";
import { Prisma } from "@prisma/client";

const avaliacaoInclude = {
  avaliador: { select: { id: true, name: true, email: true } },
  avaliado: { select: { id: true, name: true, email: true } },
  criterio: { select: { id: true, name: true, enabled: true } },
};

const avaliacao360Include = {
  avaliador: { select: { id: true, name: true, email: true } },
  avaliado: { select: { id: true, name: true, email: true } },
};

type AvaliacaoWithIncludes = Prisma.AvaliacaoGetPayload<{
  include: typeof avaliacaoInclude;
}>;
type Avaliacao360WithIncludes = Prisma.Avaliacao360GetPayload<{
  include: typeof avaliacao360Include;
}>;

@Injectable()
export class AvaliacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAvaliacaoDto) {
    // ✅ Validar criterioId obrigatório
    if (!data.criterioId) {
      throw new Error("criterioId é obrigatório");
    }

    return this.prisma.avaliacao.create({
      data,
      include: {
        criterio: { select: { id: true, name: true, enabled: true } },
        avaliador: { select: { id: true, name: true, email: true } },
        avaliado: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAllAvaliacoes(filters?: {
    idAvaliador?: number;
    idAvaliado?: number;
    idCiclo?: number;
    criterioId?: number;
  }) {
    return this.prisma.avaliacao.findMany({
      where: filters,
      include: this.getAvaliacaoIncludes(),
      orderBy: { createdAt: "desc" },
    });
  }

  async findAvaliacaoById(id: number) {
    return this.prisma.avaliacao.findUnique({
      where: { id },
      include: this.getAvaliacaoIncludes(),
    });
  }

  async updateAvaliacao(id: number, data: UpdateAvaliacaoDto) {
    return this.prisma.avaliacao.update({
      where: { id },
      data,
      include: this.getAvaliacaoIncludes(),
    });
  }

  async deleteAvaliacao(id: number) {
    return this.prisma.avaliacao.delete({
      where: { id },
    });
  }

  async findAvaliacoesByAvaliador(idAvaliador: number) {
    return this.prisma.avaliacao.findMany({
      where: { idAvaliador },
      include: {
        avaliado: {
          select: { id: true, name: true, email: true },
        },
        criterio: {
          select: { id: true, name: true, enabled: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAvaliacoesByAvaliado(idAvaliado: number) {
    return this.prisma.avaliacao.findMany({
      where: { idAvaliado },
      include: {
        avaliador: {
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
    return this.prisma.avaliacao.findMany({
      where: { idCiclo },
      include: this.getAvaliacaoIncludes(),
      orderBy: { createdAt: "desc" },
    });
  }

  async avaliacaoExists(
    idAvaliador: number,
    idAvaliado: number,
    idCiclo: number,
    criterioId: number
  ) {
    const count = await this.prisma.avaliacao.count({
      where: {
        idAvaliador,
        idAvaliado,
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
    const [totalAvaliacoes, totalAvaliacoes360, avgNota, avgNota360] =
      await Promise.all([
        this.prisma.avaliacao.count({ where: { idCiclo } }),
        this.prisma.avaliacao360.count({ where: { idCiclo } }),
        this.prisma.avaliacao.aggregate({
          where: { idCiclo, nota: { not: null } },
          _avg: { nota: true },
        }),
        this.prisma.avaliacao360.aggregate({
          where: { idCiclo, nota: { not: null } },
          _avg: { nota: true },
        }),
      ]);

    return {
      totalAvaliacoes,
      totalAvaliacoes360,
      avgNota: (avgNota._avg.nota as number) || 0,
      avgNota360: (avgNota360._avg.nota as number) || 0,
    };
  }

  async getUserPerformanceSummary(userId: number, idCiclo?: number) {
    const whereClause = idCiclo
      ? { idAvaliado: userId, idCiclo }
      : { idAvaliado: userId };

    const [avaliacoesRecebidas, avaliacoes360Recebidas] = await Promise.all([
      this.prisma.avaliacao.findMany({
        where: whereClause,
        include: {
          avaliador: { select: { id: true, name: true } },
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

  // ==================== BULK OPERATIONS ====================

  /**
   * Creates multiple Avaliacoes in a single transaction
   */
  async createBulkAvaliacoes(avaliacoes: CreateAvaliacaoDto[]) {
    return this.prisma.$transaction(async (tx) => {
      const results: AvaliacaoWithIncludes[] = [];
      for (const avaliacao of avaliacoes) {
        const result = await tx.avaliacao.create({
          data: avaliacao,
          include: this.getAvaliacaoIncludes(),
        });
        results.push(result);
      }
      return results;
    });
  }

  /**
   * Creates multiple Avaliacoes360 in a single transaction
   */
  async createBulkAvaliacoes360(avaliacoes360: CreateAvaliacao360Dto[]) {
    return this.prisma.$transaction(async (tx) => {
      const results: Avaliacao360WithIncludes[] = [];
      for (const avaliacao360 of avaliacoes360) {
        const result = await tx.avaliacao360.create({
          data: avaliacao360,
          include: this.getAvaliacao360Includes(),
        });
        results.push(result);
      }
      return results;
    });
  }

  /**
   * Creates a mix of Avaliacoes and Avaliacoes360 in a single transaction
   */
  async createBulkMixed(data: {
    avaliacoes?: CreateAvaliacaoDto[];
    avaliacoes360?: CreateAvaliacao360Dto[];
  }) {
    return this.prisma.$transaction(async (tx) => {
      const results: {
        avaliacoes: AvaliacaoWithIncludes[];
        avaliacoes360: Avaliacao360WithIncludes[];
      } = {
        avaliacoes: [],
        avaliacoes360: [],
      };

      // Create regular evaluations
      if (data.avaliacoes && data.avaliacoes.length > 0) {
        for (const avaliacao of data.avaliacoes) {
          const result = await tx.avaliacao.create({
            data: avaliacao,
            include: this.getAvaliacaoIncludes(),
          });
          results.avaliacoes.push(result);
        }
      }

      // Create 360 evaluations
      if (data.avaliacoes360 && data.avaliacoes360.length > 0) {
        for (const avaliacao360 of data.avaliacoes360) {
          const result = await tx.avaliacao360.create({
            data: avaliacao360,
            include: this.getAvaliacao360Includes(),
          });
          results.avaliacoes360.push(result);
        }
      }

      return results;
    });
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private getAvaliacaoIncludes() {
    return avaliacaoInclude;
  }

  private getAvaliacao360Includes() {
    return avaliacao360Include;
  }

  // ✅ Adicionar método updateNotaGestor
  async updateNotaGestor(id: number, notaGestor: number, justificativa?: string) {
    return await this.prisma.avaliacao.update({
      where: { id },
      data: {
        notaGestor,
        ...(justificativa && { justificativa }),
      },
      include: {
        criterio: { select: { id: true, name: true, enabled: true } },
        avaliador: { select: { id: true, name: true, email: true } },
        avaliado: { select: { id: true, name: true, email: true } },
      },
    });
  }

  // ✅ Adicionar método createBulk que o service está chamando
  async createBulk(data: BulkCreateAvaliacaoDto) {
    return this.createBulkMixed(data);
  }
}
