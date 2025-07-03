import { Test, TestingModule } from '@nestjs/testing';
import { ResumoiaController } from './resumoia.controller';
import { ResumoiaService } from './resumoia.service';

describe('ResumoiaController', () => {
  let controller: ResumoiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumoiaController],
      providers: [ResumoiaService],
    }).compile();

    controller = module.get<ResumoiaController>(ResumoiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
