import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ResumoiaService } from "src/resumoia/resumoia.service";
import { ProcessamentoAutomaticoRepository } from "./processamento-automatico.repository";
import { statusProcessamento } from "@prisma/client";

@Injectable()
export class ProcessamentoAutomaticoService {
  private readonly logger = new Logger(ProcessamentoAutomaticoService.name);

  constructor(
    private readonly repository: ProcessamentoAutomaticoRepository,
    private readonly resumoiaService: ResumoiaService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async verificarEProcessarCiclos() {
    this.logger.log("🕵️‍♂️ Verificando ciclos para processamento automático...");

    const ciclos = await this.repository.findCiclosParaProcessamento();

    if (ciclos.length === 0) {
      this.logger.log("😴 Nenhum ciclo encontrado para processamento");
      return;
    }

    this.logger.log(
      `📋 Encontrados ${ciclos.length} ciclos para processamento`
    );

    for (const ciclo of ciclos) {
      this.logger.log(
        `⚙️ Iniciando processamento automático para ciclo ${ciclo.id} (${ciclo.name})`
      );
      await this.iniciarProcessamentoAgendado(ciclo.id);
    }
  }

  async iniciarProcessamentoAgendado(cicloId: number) {
    const processo = await this.repository.createResumoProcessamento(cicloId);

    this.logger.log(
      `📋 Processo de resumo IA criado com ID: ${processo.id} para ciclo ${cicloId}`
    );

    void this.processarEmSegundoPlano(cicloId, processo.id);

    return processo;
  }

  async processarEmSegundoPlano(cicloId: number, processamentoId: string) {
    await this.repository.updateResumoProcessamentoStatus(
      processamentoId,
      statusProcessamento.PROCESSANDO
    );

    try {
      this.logger.log(
        `🚀 Iniciando processamento em segundo plano para ciclo ${cicloId}`
      );

      const statistics = await this.resumoiaService.gerarResumosParaCiclo(
        cicloId
      );

      await this.repository.updateResumoProcessamentoStatus(
        processamentoId,
        statusProcessamento.CONCLUIDO
      );

      this.logger.log(
        `✅ Processamento concluído para ciclo ${cicloId}. Estatísticas: ${JSON.stringify(
          statistics
        )}`
      );
    } catch (error) {
      await this.repository.updateResumoProcessamentoStatus(
        processamentoId,
        statusProcessamento.ERRO
      );

      this.logger.error(`❌ Erro ao processar ciclo ${cicloId}:`, error);
    }
  }
}
