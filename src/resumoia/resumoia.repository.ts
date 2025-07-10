import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ResumoiaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUsersWithAvaliacoes(idCiclo: number) {
    return this.prisma.user.findMany({
      where: {
        autoavaliacoesRecebidas: {
          some: { idCiclo },
        },
      },
      include: {
        autoavaliacoesRecebidas: {
          where: { idCiclo },
          include: {
            criterio: true,
          },
        },
        avaliacoes360Recebidas: {
          where: { idCiclo },
        },
      },
    });
  }

  async resumoAlreadyExists(userId: number, idCiclo: number) {
    return this.prisma.resumoIA.findUnique({
      where: {
        userId_idCiclo: {
          userId,
          idCiclo,
        },
      },
    });
  }

  async createResumo(userId: number, idCiclo: number, resumo: string) {
    return this.prisma.resumoIA.create({
      data: {
        userId,
        idCiclo,
        resumo,
      },
    });
  }
}
