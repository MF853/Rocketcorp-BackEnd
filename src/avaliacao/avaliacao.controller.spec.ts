import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacaoController } from './avaliacao.controller';
import { AvaliacaoService } from './avaliacao.service';

describe('AvaliacaoController', () => {
  let controller: AvaliacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliacaoController],
      providers: [AvaliacaoService],
    }).compile();

    controller = module.get<AvaliacaoController>(AvaliacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
