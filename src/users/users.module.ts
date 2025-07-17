import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { PrismaService } from "../prisma/prisma.service";
import { CryptoModule } from "../crypto/crypto.module";
import { LogModule } from "../log/log.module";

@Module({
  imports: [CryptoModule, LogModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
