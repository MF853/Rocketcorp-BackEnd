import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Trilha } from "@prisma/client";
import { CreateTrilhaDto, BulkCreateTrilhaDto } from "./dto/create-trilha.dto";
import { UpdateTrilhaDto } from "./dto/update-trilha.dto";

// Define the return types using Prisma payload types
export type TrilhaWithUsers = Prisma.TrilhaGetPayload<{
  include: {
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
  include: {
    criterio: {
      select: {
        id: true;
        name: true;
        tipo: true;
        peso: true;
        description: true;
        enabled: true;
      };
    };
  };
}>;

export type TrilhaComplete = Prisma.TrilhaGetPayload<{
  include: {
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
        enabled: true;
      };
    };
  };
}>;

export type BulkCreateResult = {
  trilhas: Trilha[];
  count: number;
};

@Injectable()
export class TrilhaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Include constants for consistent queries
  private readonly usersIncludes = {
    users: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  private readonly criteriosIncludes = {
    criterio: {
      select: {
        id: true,
        name: true,
        tipo: true,
        peso: true,
        description: true,
        enabled: true,
      },
    },
  };

  private readonly completeIncludes = {
    ...this.usersIncludes,
    ...this.criteriosIncludes,
  };

  async create(data: CreateTrilhaDto): Promise<Trilha> {
    return this.prisma.trilha.create({
      data,
    });
  }

  async createBulk(data: BulkCreateTrilhaDto): Promise<BulkCreateResult> {
    const { trilhas } = data;

    if (!trilhas || trilhas.length === 0) {
      return { trilhas: [] as Trilha[], count: 0 };
    }

    const createdTrilhas = await this.prisma.$transaction(
      trilhas.map((trilha) =>
        this.prisma.trilha.create({
          data: trilha,
        })
      )
    );

    return {
      trilhas: createdTrilhas,
      count: createdTrilhas.length,
    };
  }

  async findAll(): Promise<Trilha[]> {
    return this.prisma.trilha.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findAllWithUsers(): Promise<TrilhaWithUsers[]> {
    return this.prisma.trilha.findMany({
      include: this.usersIncludes,
      orderBy: {
        name: "asc",
      },
    });
  }

  async findAllWithCriterios(): Promise<TrilhaWithCriterios[]> {
    return this.prisma.trilha.findMany({
      include: this.criteriosIncludes,
      orderBy: {
        name: "asc",
      },
    });
  }

  async findAllComplete(): Promise<TrilhaComplete[]> {
    return this.prisma.trilha.findMany({
      include: this.completeIncludes,
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: number): Promise<Trilha | null> {
    return this.prisma.trilha.findUnique({
      where: { id },
    });
  }

  async findByIdWithUsers(id: number): Promise<TrilhaWithUsers | null> {
    return this.prisma.trilha.findUnique({
      where: { id },
      include: this.usersIncludes,
    });
  }

  async findByIdWithCriterios(id: number): Promise<TrilhaWithCriterios | null> {
    return this.prisma.trilha.findUnique({
      where: { id },
      include: this.criteriosIncludes,
    });
  }

  async findByIdComplete(id: number): Promise<TrilhaComplete | null> {
    return this.prisma.trilha.findUnique({
      where: { id },
      include: this.completeIncludes,
    });
  }

  async findByName(name: string): Promise<Trilha | null> {
    return this.prisma.trilha.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async update(id: number, data: UpdateTrilhaDto): Promise<Trilha> {
    return this.prisma.trilha.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Trilha> {
    return this.prisma.trilha.delete({
      where: { id },
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
