import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ResumoiaService } from "./resumoia.service";
import { ResumoiaController } from "./resumoia.controller";
import { ResumoiaRepository } from "./resumoia.repository";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [ConfigModule],
  controllers: [ResumoiaController],
  providers: [ResumoiaService, ResumoiaRepository, PrismaService],
})
export class ResumoiaModule {}
