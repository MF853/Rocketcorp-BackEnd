import { Test, TestingModule } from '@nestjs/testing';
import { EqualizacaoController } from './equalizacao.controller';
import { EqualizacaoService } from './equalizacao.service';

describe('EqualizacaoController', () => {
  let controller: EqualizacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EqualizacaoController],
      providers: [
        {
          provide: EqualizacaoService,
          useValue: {}, // mock simples
        },
      ],
    }).compile();

    controller = module.get<EqualizacaoController>(EqualizacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have create method', () => {
    expect(typeof controller.create).toBe('function');
  });

  it('should have findAll method', () => {
    expect(typeof controller.findAll).toBe('function');
  });
});
