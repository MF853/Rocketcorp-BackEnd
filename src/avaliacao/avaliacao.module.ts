import { Module } from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { AvaliacaoController } from './avaliacao.controller';
import { AvaliacaoRepository } from './avaliacao.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AvaliacaoController],
  providers: [
    AvaliacaoService, 
    AvaliacaoRepository, 
    PrismaService
  ],
  exports: [AvaliacaoService, AvaliacaoRepository],
})
export class AvaliacaoModule {}
