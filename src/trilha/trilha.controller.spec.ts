import { Test, TestingModule } from '@nestjs/testing';
import { TrilhaController } from './trilha.controller';
import { TrilhaService } from './trilha.service';

describe('TrilhaController', () => {
  let controller: TrilhaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrilhaController],
      providers: [TrilhaService],
    }).compile();

    controller = module.get<TrilhaController>(TrilhaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
