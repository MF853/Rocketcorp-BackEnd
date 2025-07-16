import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import {
  CreateReferenciaDto,
  BulkCreateReferenciaDto,
} from "./dto/create-referencia.dto";
import { UpdateReferenciaDto } from "./dto/update-referencia.dto";

// Define the return types using Prisma payload types
export type ReferenciaWithBothUsers = Prisma.ReferenciaGetPayload<{
  include: {
    referenciador: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    referenciado: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export type ReferenciaWithReferenciador = Prisma.ReferenciaGetPayload<{
  include: {
    referenciador: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export type ReferenciaWithReferenciado = Prisma.ReferenciaGetPayload<{
  include: {
    referenciado: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export type BulkCreateResult = {
  referencias: ReferenciaWithBothUsers[];
  count: number;
};

@Injectable()
export class ReferenciaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Include constants for consistent queries
  private readonly userIncludes = {
    select: {
      id: true,
      name: true,
      email: true,
    },
  };

  private readonly referenciadorIncludes = {
    referenciador: this.userIncludes,
  };

  private readonly referenciadoIncludes = {
    referenciado: this.userIncludes,
  };

  private readonly bothUsersIncludes = {
    referenciador: this.userIncludes,
    referenciado: this.userIncludes,
  };

  async createReferencia(
    createReferenciaDto: CreateReferenciaDto
  ): Promise<ReferenciaWithBothUsers> {
    return await this.prisma.referencia.create({
      data: createReferenciaDto,
      include: this.bothUsersIncludes,
    });
  }

  async createBulkReferencias(
    bulkCreateReferenciaDto: BulkCreateReferenciaDto
  ): Promise<BulkCreateResult> {
    const { referencias } = bulkCreateReferenciaDto;
    console.log("🔍 ReferenciaRepository.createBulkReferencias - Iniciando transação...");

    if (!referencias || referencias.length === 0) {
      throw new Error("No referencias provided for bulk creation");
    }

    return await this.prisma.$transaction(async (tx) => {
      console.log(`📝 Transação iniciada. Criando ${referencias.length} referências...`);
      const createdReferencias: ReferenciaWithBothUsers[] = [];

      for (let i = 0; i < referencias.length; i++) {
        const referencia = referencias[i];
        console.log(`📝 Criando referência ${i + 1}/${referencias.length}:`, {
          idReferenciador: referencia.idReferenciador,
          idReferenciado: referencia.idReferenciado,
          idCiclo: referencia.idCiclo,
          justificativa: referencia.justificativa.substring(0, 50) + "..."
        });

        try {
          const result = await tx.referencia.create({
            data: referencia,
            include: this.bothUsersIncludes,
          });
          console.log(`✅ Referência ${i + 1} criada com ID:`, result.id);
          createdReferencias.push(result);
        } catch (error) {
          console.error(`❌ Erro ao criar referência ${i + 1}:`, error);
          throw error;
        }
      }

      console.log(`✅ Transação concluída. ${createdReferencias.length} referências criadas.`);
      return {
        referencias: createdReferencias,
        count: createdReferencias.length,
      };
    });
  }

  async findAllReferencias(): Promise<ReferenciaWithBothUsers[]> {
    return await this.prisma.referencia.findMany({
      include: this.bothUsersIncludes,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findReferenciaById(
    id: number
  ): Promise<ReferenciaWithBothUsers | null> {
    return await this.prisma.referencia.findUnique({
      where: { id },
      include: this.bothUsersIncludes,
    });
  }

  async findReferenciasByReferenciador(
    idReferenciador: number
  ): Promise<ReferenciaWithReferenciado[]> {
    return await this.prisma.referencia.findMany({
      where: { idReferenciador },
      include: this.referenciadoIncludes,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findReferenciasByReferenciado(
    idReferenciado: number
  ): Promise<ReferenciaWithReferenciador[]> {
    return await this.prisma.referencia.findMany({
      where: { idReferenciado },
      include: this.referenciadorIncludes,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findReferenciasByCiclo(
    idCiclo: number
  ): Promise<ReferenciaWithBothUsers[]> {
    return await this.prisma.referencia.findMany({
      where: { idCiclo },
      include: this.bothUsersIncludes,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateReferencia(
    id: number,
    updateReferenciaDto: UpdateReferenciaDto
  ): Promise<ReferenciaWithBothUsers> {
    return await this.prisma.referencia.update({
      where: { id },
      data: updateReferenciaDto,
      include: this.bothUsersIncludes,
    });
  }

  async deleteReferencia(id: number): Promise<{ id: number }> {
    return await this.prisma.referencia.delete({
      where: { id },
    });
  }

  // Utility methods for checking existence
  async referenciaExists(
    idReferenciador: number,
    idReferenciado: number,
    idCiclo: number
  ): Promise<boolean> {
    const referencia = await this.prisma.referencia.findFirst({
      where: {
        idReferenciador,
        idReferenciado,
        idCiclo,
      },
    });
    return !!referencia;
  }
}
