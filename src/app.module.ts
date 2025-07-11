import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { AvaliacaoModule } from './avaliacao/avaliacao.module';
import { ReferenciaModule } from './referencia/referencia.module';
import { UsersModule } from './users/users.module';
import { TrilhaModule } from './trilha/trilha.module';
import { CriterioModule } from './criterio/criterio.module';
import { CicleModule } from './cicle/cicle.module';
import { ResumoiaModule } from './resumoia/resumoia.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({}), AvaliacaoModule, ReferenciaModule, UsersModule, TrilhaModule, CriterioModule, CicleModule, ResumoiaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
