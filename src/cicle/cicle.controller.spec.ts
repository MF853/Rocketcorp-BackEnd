import { Test, TestingModule } from '@nestjs/testing';
import { CicleController } from './cicle.controller';
import { CicleService } from './cicle.service';

describe('CicleController', () => {
  let controller: CicleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CicleController],
      providers: [
        {
          provide: CicleService,
          useValue: {}, // mock simples
        },
      ],
    }).compile();

    controller = module.get<CicleController>(CicleController);
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

  it('should have getCicloAtual method', () => {
    expect(typeof controller.getCicloAtual).toBe('function');
  });

  it('should have findOne method', () => {
    expect(typeof controller.findOne).toBe('function');
  });

  it('should have update method', () => {
    expect(typeof controller.update).toBe('function');
  });
}); 