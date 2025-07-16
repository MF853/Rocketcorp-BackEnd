import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CryptoService } from "../crypto/crypto.service";

@Injectable()
export class ResumoiaRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService
  ) {}

  async findUsersWithAvaliacoes(idCiclo: number) {
    const users = await this.prisma.user.findMany({
      where: {
        autoAvaliacoesFeitas: {
          some: { idCiclo },
        },
      },
      include: {
        autoAvaliacoesFeitas: {
          where: { idCiclo },
          include: {
            criterio: true,
          },
        },
        avaliacoes360Recebidas: {
          where: { idCiclo },
        },
        mentoringsRecebidos: {
          where: { idCiclo },
        },
      },
    });

    // Decrypt the evaluation data for each user
    return Promise.all(
      users.map(async (user) => ({
        ...user,
        autoAvaliacoesFeitas: await Promise.all(
          user.autoAvaliacoesFeitas.map(async (avaliacao) => ({
            ...avaliacao,
            justificativa: avaliacao.justificativa
              ? await this.cryptoService.decrypt(avaliacao.justificativa)
              : avaliacao.justificativa,
            justificativaGestor: avaliacao.justificativaGestor
              ? await this.cryptoService.decrypt(avaliacao.justificativaGestor)
              : avaliacao.justificativaGestor,
          }))
        ),
        avaliacoes360Recebidas: await Promise.all(
          user.avaliacoes360Recebidas.map(async (avaliacao) => ({
            ...avaliacao,
            pontosFortes: avaliacao.pontosFortes
              ? await this.cryptoService.decrypt(avaliacao.pontosFortes)
              : avaliacao.pontosFortes,
            pontosMelhora: avaliacao.pontosMelhora
              ? await this.cryptoService.decrypt(avaliacao.pontosMelhora)
              : avaliacao.pontosMelhora,
          }))
        ),
        mentoringsRecebidos: await Promise.all(
          user.mentoringsRecebidos.map(async (mentoring) => ({
            ...mentoring,
            justificativa: mentoring.justificativa
              ? await this.cryptoService.decrypt(mentoring.justificativa)
              : mentoring.justificativa,
          }))
        ),
      }))
    );
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
    return this.prisma.resumoIA.upsert({
      where: {
        userId_idCiclo: {
          userId,
          idCiclo,
        },
      },
      update: {
        resumo,
      },
      create: {
        userId,
        idCiclo,
        resumo,
      },
    });
  }
}
