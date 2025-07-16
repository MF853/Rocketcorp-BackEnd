import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UserStatisticsResponseDto } from "./dto/user-statistics-response.dto";
import { PerformanceDataDto } from "./dto/performance-data.dto";
import { EvaluationCycle } from "./dto/evaluation-cycle.dto";
import {
  UserHistoryResponseDto,
  EvaluationCycleDto,
} from "./dto/user-history.dto";
import { CryptoService } from "../crypto/crypto.service";

const userInclude = {
  mentor: { select: { id: true, name: true, email: true } },
  mentorados: { select: { id: true, name: true, email: true } },
  trilha: { select: { id: true, name: true } },
  equipe: { select: { id: true, nome: true, descricao: true } },
};

@Injectable()
export class UsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService
  ) {}

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

    // Fetch autoavaliacao records and decrypt them
    const autoavaliacaoRecords = await this.prisma.autoavaliacao.findMany({
      where: {
        idUser: userId,
        nota: { not: null },
        ...whereClause,
      },
      select: { nota: true },
    });

    const decryptedAutoavaliacaoScores = await Promise.all(
      autoavaliacaoRecords.map(async (record) => {
        if (record.nota) {
          const decrypted = await this.cryptoService.decrypt(record.nota);
          return parseFloat(decrypted);
        }
        return null;
      })
    );

    const validAutoavaliacaoScores = decryptedAutoavaliacaoScores.filter(
      (score): score is number => score !== null && !isNaN(score)
    );

    // Fetch gestor avaliacao records and decrypt them
    const gestorAvaliacaoRecords = await this.prisma.autoavaliacao.findMany({
      where: {
        idUser: userId,
        notaGestor: { not: null },
        ...whereClause,
      },
      select: { notaGestor: true },
    });

    const decryptedGestorScores = await Promise.all(
      gestorAvaliacaoRecords.map(async (record) => {
        if (record.notaGestor) {
          const decrypted = await this.cryptoService.decrypt(record.notaGestor);
          return parseFloat(decrypted);
        }
        return null;
      })
    );

    const validGestorScores = decryptedGestorScores.filter(
      (score): score is number => score !== null && !isNaN(score)
    );

    // Fetch avaliacao360 records and decrypt them
    const avaliacao360Records = await this.prisma.avaliacao360.findMany({
      where: {
        idAvaliado: userId,
        nota: { not: null },
        ...whereClause,
      },
      select: { nota: true },
    });

    const decryptedAvaliacao360Scores = await Promise.all(
      avaliacao360Records.map(async (record) => {
        if (record.nota) {
          const decrypted = await this.cryptoService.decrypt(record.nota);
          return parseFloat(decrypted);
        }
        return null;
      })
    );

    const validAvaliacao360Scores = decryptedAvaliacao360Scores.filter(
      (score): score is number => score !== null && !isNaN(score)
    );

    // Calculate averages
    const autoavaliacaoAverage =
      validAutoavaliacaoScores.length > 0
        ? validAutoavaliacaoScores.reduce((sum, score) => sum + score, 0) /
          validAutoavaliacaoScores.length
        : null;

    const gestorAvaliacaoAverage =
      validGestorScores.length > 0
        ? validGestorScores.reduce((sum, score) => sum + score, 0) /
          validGestorScores.length
        : null;

    const avaliacao360Average =
      validAvaliacao360Scores.length > 0
        ? validAvaliacao360Scores.reduce((sum, score) => sum + score, 0) /
          validAvaliacao360Scores.length
        : null;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      autoavaliacaoAverage: autoavaliacaoAverage
        ? Number(autoavaliacaoAverage.toFixed(1))
        : null,
      autoavaliacaoCount: validAutoavaliacaoScores.length,
      avaliacaoGestorAvg: gestorAvaliacaoAverage
        ? Number(gestorAvaliacaoAverage.toFixed(1))
        : null,
      avaliacaoGestorCount: validGestorScores.length,
      avaliacao360Avg: avaliacao360Average
        ? Number(avaliacao360Average.toFixed(1))
        : null,
      avaliacao360Count: validAvaliacao360Scores.length,
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

    const decryptedEqualizacoes = await Promise.all(
      equalizacoes.map(async (equalizacao) => {
        const decryptedNotaFinal = await this.cryptoService.decrypt(
          equalizacao.notaFinal
        );
        return {
          semester: `${equalizacao.ciclo.year}.${equalizacao.ciclo.period}`,
          score: parseFloat(decryptedNotaFinal),
        };
      })
    );

    return decryptedEqualizacoes;
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
          } // Calculate scores by criteria type
          const calculateScoresByType = async () => {
            const scoresByType: { [key: string]: number[] } = {};

            await Promise.all(
              autoavaliacoes.map(async (autoavaliacao) => {
                if (autoavaliacao.criterio) {
                  const tipo = autoavaliacao.criterio.tipo.toLowerCase();
                  let score: number | null = null;

                  if (autoavaliacao.notaGestor) {
                    const decryptedNotaGestor =
                      await this.cryptoService.decrypt(
                        autoavaliacao.notaGestor
                      );
                    score = parseFloat(decryptedNotaGestor);
                  } else if (autoavaliacao.nota) {
                    const decryptedNota = await this.cryptoService.decrypt(
                      autoavaliacao.nota
                    );
                    score = parseFloat(decryptedNota);
                  }

                  if (score !== null && !isNaN(score)) {
                    if (!scoresByType[tipo]) {
                      scoresByType[tipo] = [];
                    }
                    scoresByType[tipo].push(score);
                  }
                }
              })
            );

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

          const scoresByType = await calculateScoresByType();

          // Calculate autoavaliacao average (overall average)
          const autoavaliacaoScores = await Promise.all(
            autoavaliacoes.map(async (av) => {
              let score: number | null = null;

              if (av.notaGestor) {
                const decryptedNotaGestor = await this.cryptoService.decrypt(
                  av.notaGestor
                );
                score = parseFloat(decryptedNotaGestor);
              } else if (av.nota) {
                const decryptedNota = await this.cryptoService.decrypt(av.nota);
                score = parseFloat(decryptedNota);
              }

              return score;
            })
          );

          const validAutoavaliacaoScores = autoavaliacaoScores.filter(
            (score): score is number => score !== null && !isNaN(score)
          );

          const autoavaliacaoAverage =
            validAutoavaliacaoScores.length > 0
              ? validAutoavaliacaoScores.reduce(
                  (sum, score) => sum + score,
                  0
                ) / validAutoavaliacaoScores.length
              : 0;
          const cycle = `${ciclo.year}.${ciclo.period}`;

          // Decrypt finalScore if it exists
          let finalScore: number | undefined;
          if (equalizacao?.notaFinal) {
            const decryptedFinalScore = await this.cryptoService.decrypt(
              equalizacao.notaFinal
            );
            finalScore = parseFloat(decryptedFinalScore);
          }

          return {
            id: ciclo.id.toString(),
            cycle,
            status,
            finalScore,
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
