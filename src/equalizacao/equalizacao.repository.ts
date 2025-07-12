import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import { StatusEqualizacao } from "@prisma/client";

@Injectable()
export class EqualizacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getEqualizacoesByCycle(
    idCiclo: number
  ): Promise<EqualizacaoResponseDto[]> {
    // Get all users with evaluations in the cycle
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            autoAvaliacoesFeitas: {
              some: { idCiclo },
            },
          },
          {
            avaliacoes360Recebidas: {
              some: { idCiclo },
            },
          },
        ],
      },
      include: {
        ResumoIA: {
          where: { idCiclo },
          select: { resumo: true },
        },
        equalizacoesRecebidas: true,
      },
    });

    const equalizacoes = await Promise.all(
      users.map(async (user) => {
        // Check if user has an existing equalizacao
        const existingEqualizacao = user.equalizacoesRecebidas.find(
          (eq) => eq.idAvaliado === user.id
        );

        if (existingEqualizacao) {
          // Return existing equalizacao data
          return {
            idEqualizacao: existingEqualizacao.id.toString(),
            idAvaliador: existingEqualizacao.idAvaliador.toString(),
            idAvaliado: existingEqualizacao.idAvaliado.toString(),
            nomeAvaliado: user.name,
            cargoAvaliado: user.cargo || "Desenvolvedor",
            notaAutoavaliacao: existingEqualizacao.mediaAutoavaliacao,
            notaGestor: existingEqualizacao.mediaAvaliacaoGestor,
            notaAvaliacao360: existingEqualizacao.mediaAvaliacao360,
            notaFinal: existingEqualizacao.notaFinal,
            justificativa: existingEqualizacao.justificativa,
            resumoIA: user.ResumoIA?.[0]?.resumo || "",
            status:
              existingEqualizacao.status === StatusEqualizacao.FINALIZADO
                ? "Finalizado"
                : ("Pendente" as "Finalizado" | "Pendente"),
          };
        } else {
          // Get user statistics for this cycle
          const stats = await this.getUserStatistics(user.id, idCiclo);

          // Get resumo IA if exists
          const resumoIA = user.ResumoIA?.[0]?.resumo || "";

          // Generate a unique equalizacao ID for display purposes
          const idEqualizacao = `temp_${user.id}_${idCiclo}`;

          return {
            idEqualizacao,
            idAvaliador: user.id.toString(),
            idAvaliado: user.id.toString(),
            nomeAvaliado: user.name,
            cargoAvaliado: user.cargo || "Desenvolvedor",
            notaAutoavaliacao: stats?.autoavaliacaoAverage || null,
            notaGestor: stats?.avaliacaoGestorAvg || null,
            notaAvaliacao360: stats?.avaliacao360Avg || null,
            notaFinal: null,
            justificativa: null,
            resumoIA,
            status: "Pendente" as "Pendente" | "Finalizado",
          };
        }
      })
    );

    return equalizacoes.sort((a, b) =>
      a.nomeAvaliado.localeCompare(b.nomeAvaliado)
    );
  }

  private async getUserStatistics(userId: number, idCiclo?: number) {
    const whereClause = idCiclo ? { idCiclo } : {};

    // Use Autoavaliacao model as shown in the schema
    const autoavaliacaoStats = await this.prisma.autoavaliacao.aggregate({
      where: {
        idUser: userId,
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
      autoavaliacaoAverage: autoavaliacaoStats._avg.nota
        ? Number(autoavaliacaoStats._avg.nota.toFixed(1))
        : null,
      avaliacaoGestorAvg: gestorAvaliacaoStats._avg.notaGestor
        ? Number(gestorAvaliacaoStats._avg.notaGestor.toFixed(1))
        : null,
      avaliacao360Avg: avaliacao360Stats._avg.nota
        ? Number(avaliacao360Stats._avg.nota.toFixed(1))
        : null,
    };
  }
}
