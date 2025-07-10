import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UserStatisticsResponseDto } from "./dto/user-statistics-response.dto";

const userInclude = {
  mentor: { select: { id: true, name: true, email: true } },
  mentorados: { select: { id: true, name: true, email: true } },
  trilha: { select: { id: true, name: true } },
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: this.getUserIncludes(),
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: this.getUserIncludes(),
    });
  }

  async findMentorados(mentorId: number) {
    return this.prisma.user.findMany({
      where: { mentorId },
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
  }

  async findByTrilha(trilhaId: number) {
    return this.prisma.user.findMany({
      where: { trilhaId },
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
  }

  async update(
    id: number,
    data: Partial<
      Omit<Prisma.UserUpdateInput, "id" | "email" | "createdAt" | "updatedAt">
    >
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: this.getUserIncludes(),
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserStatistics(
    userId: number,
    idCiclo?: number
  ): Promise<UserStatisticsResponseDto | null> {
    const whereClause = idCiclo ? { idCiclo } : {};

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return null;
    }

    const autoavaliacaoStats = await this.prisma.autoavaliacao.aggregate({
      where: {
        idAvaliado: userId,
        idAvaliador: userId, // Self-evaluation
        nota: { not: null },
        ...whereClause,
      },
      _avg: { nota: true },
      _count: { nota: true },
    });

    const gestorAvaliacaoStats = await this.prisma.autoavaliacao.aggregate({
      where: {
        idAvaliado: userId,
        notaGestor: { not: null },
        ...whereClause,
      },
      _avg: { notaGestor: true },
      _count: { notaGestor: true },
    });

    const avaliacao360Stats = await this.prisma.avaliacao360.aggregate({
      where: {
        idAvaliado: userId,
        nota: { not: null },
        ...whereClause,
      },
      _avg: { nota: true },
      _count: { nota: true },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      autoavaliacaoAverage: autoavaliacaoStats._avg.nota
        ? Number(autoavaliacaoStats._avg.nota.toFixed(1))
        : null,
      autoavaliacaoCount: autoavaliacaoStats._count.nota,
      avaliacaoGestorAvg: gestorAvaliacaoStats._avg.notaGestor
        ? Number(gestorAvaliacaoStats._avg.notaGestor.toFixed(1))
        : null,
      avaliacaoGestorCount: gestorAvaliacaoStats._count.notaGestor || 0,
      avaliacao360Avg: avaliacao360Stats._avg.nota
        ? Number(avaliacao360Stats._avg.nota.toFixed(1))
        : null,
      avaliacao360Count: avaliacao360Stats._count.nota,
      cicloId: idCiclo || null,
    };
  }
  async getAllUsersStatisticsByCycle(
    idCiclo: number
  ): Promise<UserStatisticsResponseDto[]> {
    const [autoavaliacaoUsers, gestorAvaliacaoUsers, avaliacao360Users] =
      await Promise.all([
        this.prisma.$queryRaw<{ idAvaliado: number }[]>`
        SELECT DISTINCT "idAvaliado" 
        FROM Autoavaliacao 
        WHERE "idCiclo" = ${idCiclo} 
        AND "idAvaliador" = "idAvaliado" 
        AND nota IS NOT NULL
      `,
        this.prisma.autoavaliacao.findMany({
          where: {
            idCiclo,
            notaGestor: { not: null },
          },
          select: { idAvaliado: true },
          distinct: ["idAvaliado"],
        }),
        this.prisma.avaliacao360.findMany({
          where: {
            idCiclo,
            nota: { not: null },
          },
          select: { idAvaliado: true },
          distinct: ["idAvaliado"],
        }),
      ]);

    const allUserIds = [
      ...autoavaliacaoUsers.map((u) => u.idAvaliado),
      ...gestorAvaliacaoUsers.map((u) => u.idAvaliado),
      ...avaliacao360Users.map((u) => u.idAvaliado),
    ];

    const uniqueUserIds = [...new Set(allUserIds)];

    const statisticsPromises = uniqueUserIds.map(async (userId) => {
      return await this.getUserStatistics(userId, idCiclo);
    });

    const statistics = await Promise.all(statisticsPromises);

    const validStatistics = statistics.filter(
      (stat): stat is UserStatisticsResponseDto => stat !== null
    );
    return validStatistics.sort((a, b) =>
      a.user.name.localeCompare(b.user.name)
    );
  }

  private getUserIncludes() {
    return userInclude;
  }
}
