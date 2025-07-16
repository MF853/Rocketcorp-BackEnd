import { Test, TestingModule } from '@nestjs/testing';
import { ReferenciaController } from './referencia.controller';
import { ReferenciaService } from './referencia.service';

describe('ReferenciaController', () => {
  let controller: ReferenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenciaController],
      providers: [
        {
          provide: ReferenciaService,
          useValue: {}, // mock simples
        },
      ],
    }).compile();

    controller = module.get<ReferenciaController>(ReferenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have create method', () => {
    expect(typeof controller.create).toBe('function');
  });
  it('should have createBulk method', () => {
    expect(typeof controller.createBulk).toBe('function');
  });
  it('should have findAll method', () => {
    expect(typeof controller.findAll).toBe('function');
  });
  it('should have findOne method', () => {
    expect(typeof controller.findOne).toBe('function');
  });
  it('should have findByReferenciador method', () => {
    expect(typeof controller.findByReferenciador).toBe('function');
  });
  it('should have findByReferenciado method', () => {
    expect(typeof controller.findByReferenciado).toBe('function');
  });
  it('should have findByCiclo method', () => {
    expect(typeof controller.findByCiclo).toBe('function');
  });
  it('should have update method', () => {
    expect(typeof controller.update).toBe('function');
  });
  it('should have remove method', () => {
    expect(typeof controller.remove).toBe('function');
  });
});
