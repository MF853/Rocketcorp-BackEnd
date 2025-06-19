import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { AvaliacaoModule } from './avaliacao/avaliacao.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({}), AvaliacaoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
