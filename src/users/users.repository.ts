import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UserStatisticsResponseDto } from "./dto/user-statistics-response.dto";
import { PerformanceDataDto } from "./dto/performance-data.dto";
import { EvaluationCycle, EvaluationScore } from "./dto/evaluation-cycle.dto";
import {
  UserHistoryResponseDto,
  EvaluationCycleDto,
  EvaluationScoreDto,
} from "./dto/user-history.dto";

const userInclude = {
  mentor: { select: { id: true, name: true, email: true } },
  mentorados: { select: { id: true, name: true, email: true } },
  trilha: { select: { id: true, name: true } },
  equipe: { select: { id: true, nome: true, descricao: true } },
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
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

  async findByEquipe(equipeId: number) {
    return this.prisma.user.findMany({
      where: { idEquipe: equipeId },
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
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
        this.prisma.$queryRaw<{ idUser: number }[]>`
        SELECT DISTINCT "idUser" 
        FROM Autoavaliacao 
        WHERE "idCiclo" = ${idCiclo} 
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
      ...autoavaliacaoUsers.map((u) => u.idUser),
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

  async findUsersWithAutoavaliacaoByCiclo(idCiclo: number) {
    // Busca todos os usuários que fizeram autoavaliação no ciclo
    const autoavaliacoes = await this.prisma.autoavaliacao.findMany({
      where: { idCiclo },
      select: { idUser: true },
      distinct: ["idUser"],
    });
    const userIds = autoavaliacoes.map((a) => a.idUser);
    if (userIds.length === 0) return [];
    return this.prisma.user.findMany({
      where: { id: { in: userIds } },
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
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

  async getUserPerformanceData(userId: number): Promise<PerformanceDataDto[]> {
    const equalizacoes = await this.prisma.equalizacao.findMany({
      where: { idAvaliado: userId },
      include: {
        ciclo: {
          select: {
            name: true,
            year: true,
            period: true,
          },
        },
      },
      orderBy: [{ ciclo: { year: "asc" } }, { ciclo: { period: "asc" } }],
    });

    return equalizacoes.map((equalizacao) => ({
      semester: `${equalizacao.ciclo.year}.${equalizacao.ciclo.period}`,
      score: equalizacao.notaFinal,
    }));
  }

  async getUserEvaluationCycles(userId: number): Promise<EvaluationCycle[]> {
    const ciclos = await this.prisma.ciclo.findMany({
      include: {
        Equalizacao: {
          where: { idAvaliado: userId },
        },
        ResumoIA: {
          where: { userId },
        },
      },
      orderBy: [{ year: "asc" }, { period: "asc" }],
    });

    const currentDate = new Date();

    const evaluationCycles = (
      await Promise.all(
        ciclos.map(async (ciclo) => {
          const equalizacao = ciclo.Equalizacao[0];
          const resumoIA = ciclo.ResumoIA[0];

          // Get autoavaliacao data with criteria information
          const autoavaliacoes = await this.prisma.autoavaliacao.findMany({
            where: {
              idUser: userId,
              idCiclo: ciclo.id,
            },
            include: {
              criterio: {
                select: {
                  tipo: true,
                },
              },
            },
          });

          // Skip this cycle if user has no evaluations
          if (autoavaliacoes.length === 0) {
            return null;
          }

          // Determine status based on dates
          let status: "em-andamento" | "finalizado";
          const dataAbertura = new Date(ciclo.dataAberturaAvaliacao);
          const dataFinalizacao = new Date(ciclo.dataFinalizacao);

          if (currentDate >= dataAbertura && currentDate <= dataFinalizacao) {
            status = "em-andamento";
          } else {
            status = "finalizado";
          }

          // Calculate scores by criteria type
          const calculateScoresByType = () => {
            const scoresByType: { [key: string]: number[] } = {};

            autoavaliacoes.forEach((autoavaliacao) => {
              if (autoavaliacao.criterio) {
                const tipo = autoavaliacao.criterio.tipo.toLowerCase();
                const score = autoavaliacao.notaGestor ?? autoavaliacao.nota;

                if (score !== null && score !== undefined) {
                  if (!scoresByType[tipo]) {
                    scoresByType[tipo] = [];
                  }
                  scoresByType[tipo].push(score);
                }
              }
            });

            // Calculate averages
            const averages: { [key: string]: number } = {};
            Object.keys(scoresByType).forEach((tipo) => {
              const scores = scoresByType[tipo];
              if (scores.length > 0) {
                averages[tipo] =
                  scores.reduce((sum, score) => sum + score, 0) / scores.length;
              }
            });

            return averages;
          };

          const scoresByType = calculateScoresByType();

          // Calculate autoavaliacao average (overall average)
          const autoavaliacaoScores = autoavaliacoes
            .map((av) => av.notaGestor ?? av.nota)
            .filter(
              (score): score is number => score !== null && score !== undefined
            );

          const autoavaliacaoAverage =
            autoavaliacaoScores.length > 0
              ? autoavaliacaoScores.reduce((sum, score) => sum + score, 0) /
                autoavaliacaoScores.length
              : 0;

          const cycle = `${ciclo.year}.${ciclo.period}`;

          return {
            id: ciclo.id.toString(),
            cycle,
            status,
            finalScore: equalizacao?.notaFinal,
            scores: {
              autoavaliacao: autoavaliacaoAverage,
              execucao: scoresByType["tecnico"] || 0,
              postura: scoresByType["comportamental"] || 0,
              gestao: scoresByType["gestao"],
            },
            resumo: resumoIA?.resumo || "",
            period: cycle,
            completionDate:
              status === "finalizado"
                ? ciclo.dataFinalizacao.toISOString()
                : undefined,
          };
        })
      )
    ).filter((cycle) => cycle !== null) as EvaluationCycle[];

    return evaluationCycles;
  }

  async getUserHistory(userId: number): Promise<UserHistoryResponseDto> {
    // Get user basic info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Get performance data (historical scores)
    const performanceData = await this.getUserPerformanceData(userId);

    // Get evaluation cycles
    const evaluationCycles = await this.getUserEvaluationCycles(userId);

    // Convert EvaluationCycle to EvaluationCycleDto
    const evaluationCyclesDto: EvaluationCycleDto[] = evaluationCycles.map(
      (cycle) => ({
        id: cycle.id,
        cycle: cycle.cycle,
        status: cycle.status,
        finalScore: cycle.finalScore,
        scores: {
          autoavaliacao: cycle.scores.autoavaliacao,
          execucao: cycle.scores.execucao,
          postura: cycle.scores.postura,
          gestao: cycle.scores.gestao,
        },
        resumo: cycle.resumo,
        period: cycle.period,
        completionDate: cycle.completionDate,
      })
    );

    // Calculate current and last scores
    const sortedPerformanceData = performanceData.sort((a, b) => {
      const [aYear, aPeriod] = a.semester.split(".").map(Number);
      const [bYear, bPeriod] = b.semester.split(".").map(Number);
      if (aYear !== bYear) return bYear - aYear; // Recent year first
      return bPeriod - aPeriod; // Recent period first
    });

    const currentScore =
      sortedPerformanceData.length > 0 ? sortedPerformanceData[0].score : 0;
    const currentSemester =
      sortedPerformanceData.length > 0 ? sortedPerformanceData[0].semester : "";
    const lastScore =
      sortedPerformanceData.length > 1 ? sortedPerformanceData[1].score : 0;
    const lastSemester =
      sortedPerformanceData.length > 1 ? sortedPerformanceData[1].semester : "";
    const growth = currentScore - lastScore;

    // Count total evaluations
    const totalEvaluations = await this.prisma.autoavaliacao.count({
      where: {
        idUser: userId,
        OR: [{ nota: { not: null } }, { notaGestor: { not: null } }],
      },
    });

    return {
      userId: user.id,
      userName: user.name,
      currentScore,
      currentSemester,
      lastScore,
      lastSemester,
      growth,
      totalEvaluations,
      performanceData,
      evaluationCycles: evaluationCyclesDto,
    };
  }
}
