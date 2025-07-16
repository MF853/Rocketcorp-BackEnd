import { Test, TestingModule } from '@nestjs/testing';
import { EquipeController } from './equipe.controller';
import { EquipeService } from './equipe.service';

describe('EquipeController', () => {
  let controller: EquipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipeController],
      providers: [
        {
          provide: EquipeService,
          useValue: {}, // mock simples
        },
      ],
    }).compile();

    controller = module.get<EquipeController>(EquipeController);
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

  it('should have findOne method', () => {
    expect(typeof controller.findOne).toBe('function');
  });

  it('should have update method', () => {
    expect(typeof controller.update).toBe('function');
  });

  it('should have remove method', () => {
    expect(typeof controller.remove).toBe('function');
  });
}); 