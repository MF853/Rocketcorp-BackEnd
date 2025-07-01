import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { AvaliacaoModule } from '../avaliacao/avaliacao.module';
import { ReferenciaModule } from '../referencia/referencia.module';
import { UsersModule } from '../users/users.module';
import { TrilhaModule } from '../trilha/trilha.module';
import { CriterioModule } from '../criterio/criterio.module';


@Module({
  imports: [AvaliacaoModule, ReferenciaModule, UsersModule, TrilhaModule, CriterioModule],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule {}