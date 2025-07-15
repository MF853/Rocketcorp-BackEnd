import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ProcessamentoAutomaticoService } from "./processamento-automatico.service";
import { ProcessamentoAutomaticoRepository } from "./processamento-automatico.repository";
import { PrismaService } from "../prisma/prisma.service";
import { ResumoiaModule } from "../resumoia/resumoia.module";

@Module({
  imports: [ScheduleModule.forRoot(), ResumoiaModule],
  providers: [
    ProcessamentoAutomaticoService,
    ProcessamentoAutomaticoRepository,
    PrismaService,
  ],
  exports: [ProcessamentoAutomaticoService],
})
export class SchedulerModule {}
