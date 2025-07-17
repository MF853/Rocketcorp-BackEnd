import { Module } from "@nestjs/common";
import { CriterioService } from "./criterio.service";
import { CriterioController } from "./criterio.controller";
import { CriterioRepository } from "./criterio.repository";
import { PrismaService } from "../prisma/prisma.service";
import { LogModule } from '../log/log.module';

@Module({
  imports: [LogModule],
  controllers: [CriterioController],
  providers: [CriterioService, CriterioRepository, PrismaService],
  exports: [CriterioService, CriterioRepository],
})
export class CriterioModule {}
