import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { AvaliacaoModule } from "./avaliacao/avaliacao.module";
import { ReferenciaModule } from "./referencia/referencia.module";
import { UsersModule } from "./users/users.module";
import { TrilhaModule } from "./trilha/trilha.module";
import { CriterioModule } from "./criterio/criterio.module";
import { ExcelService } from "./excel/excel.service";
import { ExcelModule } from "./excel/excel.module";
import { CicleModule } from "./cicle/cicle.module";
import { ResumoiaModule } from "./resumoia/resumoia.module";
import { EqualizacaoModule } from "./equalizacao/equalizacao.module";
import { EquipeModule } from "./equipe/equipe.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { LogModule } from './log/log.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({}),
    AvaliacaoModule,
    ReferenciaModule,
    UsersModule,
    TrilhaModule,
    CriterioModule,
    CicleModule,
    ResumoiaModule,
    EqualizacaoModule,
    ExcelModule,
    EquipeModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService, ExcelService],
})
export class AppModule {}
