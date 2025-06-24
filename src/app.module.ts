import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { AvaliacaoModule } from './avaliacao/avaliacao.module';
import { ReferenciaModule } from './referencia/referencia.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({}), AvaliacaoModule, ReferenciaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
