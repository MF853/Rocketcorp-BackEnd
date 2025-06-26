import { Test, TestingModule } from '@nestjs/testing';
import { CriterioController } from './criterio.controller';
import { CriterioService } from './criterio.service';

describe('CriterioController', () => {
  let controller: CriterioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CriterioController],
      providers: [CriterioService],
    }).compile();

    controller = module.get<CriterioController>(CriterioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
