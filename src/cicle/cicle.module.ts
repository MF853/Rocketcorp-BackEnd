import { Module } from '@nestjs/common';
import { CicleService } from './cicle.service';
import { CicleController } from './cicle.controller';

@Module({
  controllers: [CicleController],
  providers: [CicleService],
})
export class CicleModule {}
