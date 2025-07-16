import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ResumoiaService } from "./resumoia.service";
import { ResumoiaController } from "./resumoia.controller";
import { ResumoiaRepository } from "./resumoia.repository";
import { PrismaService } from "../prisma/prisma.service";
import { CryptoModule } from "../crypto/crypto.module";

@Module({
  imports: [ConfigModule, CryptoModule],
  controllers: [ResumoiaController],
  providers: [ResumoiaService, ResumoiaRepository, PrismaService],
  exports: [ResumoiaService],
})
export class ResumoiaModule {}
