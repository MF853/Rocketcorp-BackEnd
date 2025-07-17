import { Module } from "@nestjs/common";
import { EqualizacaoService } from "./equalizacao.service";
import { EqualizacaoController } from "./equalizacao.controller";
import { EqualizacaoRepository } from "./equalizacao.repository";
import { PrismaService } from "../prisma/prisma.service";
import { UsersModule } from "../users/users.module";
import { CicleModule } from "../cicle/cicle.module";
import { CryptoModule } from "../crypto/crypto.module";

@Module({
  imports: [UsersModule, CicleModule, CryptoModule],
  controllers: [EqualizacaoController],
  providers: [EqualizacaoService, EqualizacaoRepository, PrismaService],
  exports: [EqualizacaoService],
})
export class EqualizacaoModule {}
