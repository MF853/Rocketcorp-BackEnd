import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { CreateTrilhaDto, BulkCreateTrilhaDto } from "./dto/create-trilha.dto";
import { UpdateTrilhaDto } from "./dto/update-trilha.dto";
import { BulkUpdateTrilhaDto } from "./dto/bulk-update-trilha.dto";

// Define the return types using Prisma payload types
export type TrilhaBasic = {
  id: number;
  name: string;
};

export type TrilhaWithUsers = Prisma.TrilhaGetPayload<{
  select: {
    id: true;
    name: true;
    users: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export type TrilhaWithCriterios = Prisma.TrilhaGetPayload<{
  select: {
    id: true;
    name: true;
    criterio: {
      select: {
        id: true;
        name: true;
        tipo: true;
        peso: true;
        description: true;
        idCiclo: true;
        enabled: true;
      };
    };
  };
}>;

export type TrilhaComplete = Prisma.TrilhaGetPayload<{
  select: {
    id: true;
    name: true;
    users: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    criterio: {
      select: {
        id: true;
        name: true;
        tipo: true;
        peso: true;
        description: true;
        idCiclo: true;
        enabled: true;
      };
    };
  };
}>;

export type BulkCreateResult = {
  trilhas: TrilhaBasic[];
  count: number;
};

export type BulkUpdateResult = {
  trilhas: TrilhaBasic[];
  count: number;
  updated: number[];
  notFound: number[];
};

@Injectable()
export class TrilhaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Select constants for consistent queries (excluding createdAt and updatedAt)
  private readonly baseSelect = {
    id: true,
    name: true,
  };

  private readonly usersSelect = {
    ...this.baseSelect,
    users: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  private readonly criteriosSelect = {
    ...this.baseSelect,
    criterio: {
      select: {
        id: true,
        name: true,
        tipo: true,
        peso: true,
        description: true,
        idCiclo: true,
        enabled: true,
      },
    },
  };

  private readonly completeSelect = {
    ...this.baseSelect,
    users: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    criterio: {
      select: {
        id: true,
        name: true,
        tipo: true,
        peso: true,
        description: true,
        idCiclo: true,
        enabled: true,
      },
    },
  };

  async create(data: CreateTrilhaDto): Promise<TrilhaBasic> {
    return this.prisma.trilha.create({
      data,
      select: this.baseSelect,
    });
  }

  async createBulk(data: BulkCreateTrilhaDto): Promise<BulkCreateResult> {
    const { trilhas } = data;
    if (!trilhas || trilhas.length === 0) {
      return { trilhas: [] as TrilhaBasic[], count: 0 };
    }

    const createdTrilhas = await this.prisma.$transaction(
      trilhas.map((trilha) =>
        this.prisma.trilha.create({
          data: trilha,
          select: this.baseSelect,
        })
      )
    );

    return {
      trilhas: createdTrilhas,
      count: createdTrilhas.length,
    };
  }

  async findAll(): Promise<TrilhaBasic[]> {
    return this.prisma.trilha.findMany({
      select: this.baseSelect,
      orderBy: {
        name: "asc",
      },
    });
  }

  async findAllWithUsers(): Promise<TrilhaWithUsers[]> {
    return this.prisma.trilha.findMany({
      select: this.usersSelect,
      orderBy: {
        name: "asc",
      },
    });
  }

  async findAllWithCriterios(): Promise<TrilhaWithCriterios[]> {
    return this.prisma.trilha.findMany({
      select: this.criteriosSelect,
      orderBy: {
        name: "asc",
      },
    });
  }

  async findAllComplete(): Promise<TrilhaComplete[]> {
    return this.prisma.trilha.findMany({
      select: this.completeSelect,
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: number): Promise<TrilhaBasic | null> {
    return this.prisma.trilha.findUnique({
      where: { id },
      select: this.baseSelect,
    });
  }

  async findByIdWithUsers(id: number): Promise<TrilhaWithUsers | null> {
    return this.prisma.trilha.findUnique({
      where: { id },
      select: this.usersSelect,
    });
  }

  async findByIdWithCriterios(id: number): Promise<TrilhaWithCriterios | null> {
    return this.prisma.trilha.findUnique({
      where: { id },
      select: this.criteriosSelect,
    });
  }

  async findByIdComplete(id: number): Promise<TrilhaComplete | null> {
    return this.prisma.trilha.findUnique({
      where: { id },
      select: this.completeSelect,
    });
  }

  async findByName(name: string): Promise<TrilhaBasic | null> {
    return this.prisma.trilha.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
      select: this.baseSelect,
    });
  }

  async update(id: number, data: UpdateTrilhaDto): Promise<TrilhaBasic> {
    return this.prisma.trilha.update({
      where: { id },
      data,
      select: this.baseSelect,
    });
  }

  async updateBulk(data: BulkUpdateTrilhaDto): Promise<BulkUpdateResult> {
    const { trilhas } = data;

    if (!trilhas || trilhas.length === 0) {
      return {
        trilhas: [] as TrilhaBasic[],
        count: 0,
        updated: [],
        notFound: [],
      };
    }

    const results: TrilhaBasic[] = [];
    const updated: number[] = [];
    const notFound: number[] = [];

    // Process each update individually to handle not found cases
    for (const trilhaUpdate of trilhas) {
      try {
        const updatedTrilha = await this.prisma.trilha.update({
          where: { id: trilhaUpdate.id },
          data: { name: trilhaUpdate.name },
          select: this.baseSelect,
        });
        results.push(updatedTrilha);
        updated.push(trilhaUpdate.id);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          notFound.push(trilhaUpdate.id);
        } else {
          throw error;
        }
      }
    }

    return {
      trilhas: results,
      count: results.length,
      updated,
      notFound,
    };
  }

  async delete(id: number): Promise<TrilhaBasic> {
    return this.prisma.trilha.delete({
      where: { id },
      select: this.baseSelect,
    });
  }

  async count(): Promise<number> {
    return this.prisma.trilha.count();
  }

  async exists(id: number): Promise<boolean> {
    const trilha = await this.prisma.trilha.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!trilha;
  }

  async existsByName(name: string): Promise<boolean> {
    const trilha = await this.prisma.trilha.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });
    return !!trilha;
  }
}
