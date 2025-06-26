import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Criterio } from "@prisma/client";
import {
  CreateCriterioDto,
  BulkCreateCriterioDto,
} from "./dto/create-criterio.dto";
import {
  UpdateCriterioDto,
  BulkUpdateCriterioDto,
} from "./dto/update-criterio.dto";

// Define the return types using Prisma payload types
export type CriterioWithTrilha = Prisma.CriterioGetPayload<{
  include: {
    trilha: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type CriterioWithCiclo = Prisma.CriterioGetPayload<{
  include: {
    ciclo: {
      select: {
        id: true;
        name: true;
        year: true;
        period: true;
        status: true;
      };
    };
  };
}>;

export type CriterioComplete = Prisma.CriterioGetPayload<{
  include: {
    trilha: {
      select: {
        id: true;
        name: true;
      };
    };
    ciclo: {
      select: {
        id: true;
        name: true;
        year: true;
        period: true;
        status: true;
      };
    };
    avaliacoes: {
      select: {
        id: true;
        nota: true;
        justificativa: true;
      };
    };
  };
}>;

export type BulkCreateResult = {
  criterios: Criterio[];
  count: number;
};

export type BulkUpdateResult = {
  criterios: Criterio[];
  count: number;
  updated: number[];
  notFound: number[];
};

@Injectable()
export class CriterioRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Include constants for consistent queries
  private readonly trilhaIncludes = {
    trilha: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  private readonly cicloIncludes = {
    ciclo: {
      select: {
        id: true,
        name: true,
        year: true,
        period: true,
        status: true,
      },
    },
  };

  private readonly avaliacoesIncludes = {
    avaliacoes: {
      select: {
        id: true,
        nota: true,
        justificativa: true,
      },
    },
  };

  private readonly completeIncludes = {
    ...this.trilhaIncludes,
    ...this.cicloIncludes,
    ...this.avaliacoesIncludes,
  };

  async create(data: CreateCriterioDto): Promise<Criterio> {
    return this.prisma.criterio.create({
      data,
    });
  }

  async createBulk(data: BulkCreateCriterioDto): Promise<BulkCreateResult> {
    const { criterios } = data;

    if (!criterios || criterios.length === 0) {
      return { criterios: [] as Criterio[], count: 0 };
    }

    const createdCriterios = await this.prisma.$transaction(
      criterios.map((criterio) =>
        this.prisma.criterio.create({
          data: criterio,
        })
      )
    );

    return {
      criterios: createdCriterios,
      count: createdCriterios.length,
    };
  }

  async updateBulk(data: BulkUpdateCriterioDto): Promise<BulkUpdateResult> {
    const { criterios } = data;

    if (!criterios || criterios.length === 0) {
      return {
        criterios: [] as Criterio[],
        count: 0,
        updated: [],
        notFound: [],
      };
    }

    const results: Criterio[] = [];
    const updated: number[] = [];
    const notFound: number[] = [];

    // Process each update individually to handle not found cases
    for (const criterioUpdate of criterios) {
      try {
        const { id, ...updateData } = criterioUpdate;
        const updatedCriterio = await this.prisma.criterio.update({
          where: { id },
          data: updateData,
        });
        results.push(updatedCriterio);
        updated.push(id);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          notFound.push(criterioUpdate.id);
        } else {
          throw error;
        }
      }
    }

    return {
      criterios: results,
      count: results.length,
      updated,
      notFound,
    };
  }

  async findAll(): Promise<Criterio[]> {
    return this.prisma.criterio.findMany({
      orderBy: [{ trilhaId: "asc" }, { name: "asc" }],
    });
  }

  async findAllWithTrilha(): Promise<CriterioWithTrilha[]> {
    return this.prisma.criterio.findMany({
      include: this.trilhaIncludes,
      orderBy: [{ trilhaId: "asc" }, { name: "asc" }],
    });
  }

  async findAllWithCiclo(): Promise<CriterioWithCiclo[]> {
    return this.prisma.criterio.findMany({
      include: this.cicloIncludes,
      orderBy: [{ trilhaId: "asc" }, { name: "asc" }],
    });
  }

  async findAllComplete(): Promise<CriterioComplete[]> {
    return this.prisma.criterio.findMany({
      include: this.completeIncludes,
      orderBy: [{ trilhaId: "asc" }, { name: "asc" }],
    });
  }

  async findById(id: number): Promise<Criterio | null> {
    return this.prisma.criterio.findUnique({
      where: { id },
    });
  }

  async findByIdWithTrilha(id: number): Promise<CriterioWithTrilha | null> {
    return this.prisma.criterio.findUnique({
      where: { id },
      include: this.trilhaIncludes,
    });
  }

  async findByIdWithCiclo(id: number): Promise<CriterioWithCiclo | null> {
    return this.prisma.criterio.findUnique({
      where: { id },
      include: this.cicloIncludes,
    });
  }

  async findByIdComplete(id: number): Promise<CriterioComplete | null> {
    return this.prisma.criterio.findUnique({
      where: { id },
      include: this.completeIncludes,
    });
  }

  async findByTrilhaId(trilhaId: number): Promise<Criterio[]> {
    return this.prisma.criterio.findMany({
      where: { trilhaId },
      orderBy: { name: "asc" },
    });
  }

  async findByCicloId(idCiclo: number): Promise<Criterio[]> {
    return this.prisma.criterio.findMany({
      where: { idCiclo },
      orderBy: [{ trilhaId: "asc" }, { name: "asc" }],
    });
  }

  async findByTrilhaAndCiclo(
    trilhaId: number,
    idCiclo: number
  ): Promise<Criterio[]> {
    return this.prisma.criterio.findMany({
      where: {
        trilhaId,
        idCiclo,
      },
      orderBy: { name: "asc" },
    });
  }

  async findEnabled(): Promise<Criterio[]> {
    return this.prisma.criterio.findMany({
      where: { enabled: true },
      orderBy: [{ trilhaId: "asc" }, { name: "asc" }],
    });
  }

  async update(id: number, data: UpdateCriterioDto): Promise<Criterio> {
    return this.prisma.criterio.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Criterio> {
    return this.prisma.criterio.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return this.prisma.criterio.count();
  }

  async countByTrilha(trilhaId: number): Promise<number> {
    return this.prisma.criterio.count({
      where: { trilhaId },
    });
  }

  async countByCiclo(idCiclo: number): Promise<number> {
    return this.prisma.criterio.count({
      where: { idCiclo },
    });
  }

  async exists(id: number): Promise<boolean> {
    const criterio = await this.prisma.criterio.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!criterio;
  }

  async existsByNameAndTrilha(
    name: string,
    trilhaId: number
  ): Promise<boolean> {
    const criterio = await this.prisma.criterio.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        trilhaId,
      },
      select: { id: true },
    });
    return !!criterio;
  }
}
