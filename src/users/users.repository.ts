import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UserStatisticsResponseDto } from "./dto/user-statistics-response.dto";

const userInclude = {
  mentor: { select: { id: true, name: true, email: true } },
  mentorados: { select: { id: true, name: true, email: true } },
  trilha: { select: { id: true, name: true } },
  equipe: { select: { id: true, nome: true, descricao: true } },
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.user.create({
      data,
    });
  }

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

  async findByEquipe(_equipeId: number) {
    // TODO: Descomentar após regenerar o Prisma Client com o campo idEquipe
    // return this.prisma.user.findMany({
    //   where: { idEquipe: equipeId },
    //   include: this.getUserIncludes(),
    //   orderBy: { name: "asc" },
    // });
    console.log(
      "🔧 Método findByEquipe temporariamente desabilitado - aguardando regeneração do Prisma Client"
    );
    return [];
  }

  async findEquipeById(idEquipe: number) {
    return this.prisma.equipe.findUnique({ where: { id: idEquipe } });
  }

  async findMembrosAndGestorByEquipe(equipeId: number) {
    // Busca a equipe, incluindo gestor e membros
    const equipe = await this.prisma.equipe.findUnique({
      where: { id: equipeId },
      include: {
        gestor: true,
        membros: true,
      },
    });
    if (!equipe) return [];
    // Retorna gestor + membros (sem duplicidade)
    const allUsers = [
      equipe.gestor,
      ...equipe.membros.filter((m) => m.id !== equipe.gestor.id),
    ];
    return allUsers;
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
        idUser: userId, // Self-evaluation
        nota: { not: null },
        ...whereClause,
      },
      _avg: { nota: true },
      _count: { nota: true },
    });

    const gestorAvaliacaoStats = await this.prisma.autoavaliacao.aggregate({
      where: {
        idUser: userId,
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
          select: { idUser: true },
          distinct: ["idUser"],
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
      ...gestorAvaliacaoUsers.map((u) => u.idUser),
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

  async findMentores() {
    return this.prisma.user.findMany({
      where: {
        role: {
          has: "mentor",
        },
      },
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
  }

  async findLideradosByGestor(gestorId: number) {
    return this.prisma.user.findMany({
      where: { gestorId },
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
  }

  private getUserIncludes() {
    return userInclude;
  }
}
