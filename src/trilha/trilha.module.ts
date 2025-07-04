import { Module } from "@nestjs/common";
import { TrilhaService } from "./trilha.service";
import { TrilhaController } from "./trilha.controller";
import { TrilhaRepository } from "./trilha.repository";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [TrilhaController],
  providers: [TrilhaService, TrilhaRepository, PrismaService],
})
export class TrilhaModule {}
