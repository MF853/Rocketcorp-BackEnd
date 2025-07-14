import { Module } from '@nestjs/common';
import { EquipeService } from './equipe.service';
import { EquipeController } from './equipe.controller';
import { EquipeRepository } from './equipe.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [EquipeController],
  providers: [EquipeService, EquipeRepository, PrismaService],
  exports: [EquipeService],
})
export class EquipeModule {} 