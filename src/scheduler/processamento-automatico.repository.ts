import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { statusProcessamento } from "@prisma/client";

@Injectable()
export class ProcessamentoAutomaticoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createResumoProcessamento(cicloId: number) {
    return await this.prisma.resumoProcessamento.create({
      data: {
        cicloId,
        status: statusProcessamento.PENDENTE,
      },
    });
  }

  async updateResumoProcessamentoStatus(
    processamentoId: string,
    status: statusProcessamento
  ) {
    return await this.prisma.resumoProcessamento.update({
      where: { id: processamentoId },
      data: {
        status,
      },
    });
  }

  async findCiclosParaProcessamento() {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);

    return await this.prisma.ciclo.findMany({
      where: {
        dataFechamentoRevisaoGestor: {
          lte: ontem,
        },
        ResumoIA: {
          none: {},
        },
        // Evita processar ciclos que já estão sendo processados
        ResumoProcessamento: {
          none: {
            status: {
              in: ["PENDENTE", "PROCESSANDO"],
            },
          },
        },
      },
    });
  }
}
