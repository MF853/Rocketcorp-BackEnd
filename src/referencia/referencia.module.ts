import { Module } from "@nestjs/common";
import { ReferenciaService } from "./referencia.service";
import { ReferenciaController } from "./referencia.controller";
import { ReferenciaRepository } from "./referencia.repository";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [ReferenciaController],
  providers: [ReferenciaService, ReferenciaRepository, PrismaService],
  exports: [ReferenciaService],
})
export class ReferenciaModule {}
