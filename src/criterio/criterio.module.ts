import { Module } from "@nestjs/common";
import { CriterioService } from "./criterio.service";
import { CriterioController } from "./criterio.controller";
import { CriterioRepository } from "./criterio.repository";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [CriterioController],
  providers: [CriterioService, CriterioRepository, PrismaService],
  exports: [CriterioService, CriterioRepository],
})
export class CriterioModule {}
