import { Module } from '@nestjs/common';
import { CicleService } from './cicle.service';
import { CicleController } from './cicle.controller';
import { CicleRepository } from "./cicle.repository";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [CicleController],
  providers: [CicleService, CicleRepository, PrismaService],
  exports: [CicleService],
})
export class CicleModule {}
