import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LogController],
  providers: [LogService, PrismaService],
  exports: [LogService],
})
export class LogModule {} 