import { Test, TestingModule } from '@nestjs/testing';
import { AvaliacaoController } from './avaliacao.controller';
import { AvaliacaoService } from './avaliacao.service';

describe('AvaliacaoController', () => {
  let controller: AvaliacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliacaoController],
      providers: [
        {
          provide: AvaliacaoService,
          useValue: {}, // mock simples
        },
      ],
    }).compile();

    controller = module.get<AvaliacaoController>(AvaliacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have create360 method', () => {
    expect(typeof controller.create360).toBe('function');
  });
  it('should have findAll360 method', () => {
    expect(typeof controller.findAll360).toBe('function');
  });
  it('should have findOne360 method', () => {
    expect(typeof controller.findOne360).toBe('function');
  });
  it('should have find360ByAvaliadorId method', () => {
    expect(typeof controller.find360ByAvaliadorId).toBe('function');
  });
  it('should have find360ByAvaliadoId method', () => {
    expect(typeof controller.find360ByAvaliadoId).toBe('function');
  });
  it('should have find360ByCicloId method', () => {
    expect(typeof controller.find360ByCicloId).toBe('function');
  });
  it('should have update360 method', () => {
    expect(typeof controller.update360).toBe('function');
  });
  it('should have remove360 method', () => {
    expect(typeof controller.remove360).toBe('function');
  });
  it('should have createMentoring method', () => {
    expect(typeof controller.createMentoring).toBe('function');
  });
  it('should have findAllMentoring method', () => {
    expect(typeof controller.findAllMentoring).toBe('function');
  });
  it('should have findOneMentoring method', () => {
    expect(typeof controller.findOneMentoring).toBe('function');
  });
  it('should have findMentoringByMentor method', () => {
    expect(typeof controller.findMentoringByMentor).toBe('function');
  });
  it('should have findMentoringByMentorado method', () => {
    expect(typeof controller.findMentoringByMentorado).toBe('function');
  });
  it('should have findMentoringByCiclo method', () => {
    expect(typeof controller.findMentoringByCiclo).toBe('function');
  });
  it('should have updateMentoring method', () => {
    expect(typeof controller.updateMentoring).toBe('function');
  });
  it('should have removeMentoring method', () => {
    expect(typeof controller.removeMentoring).toBe('function');
  });
  it('should have create method', () => {
    expect(typeof controller.create).toBe('function');
  });
  it('should have createBulk method', () => {
    expect(typeof controller.createBulk).toBe('function');
  });
  it('should have testCreate method', () => {
    expect(typeof controller.testCreate).toBe('function');
  });
  it('should have findAll method', () => {
    expect(typeof controller.findAll).toBe('function');
  });
  it('should have update method', () => {
    expect(typeof controller.update).toBe('function');
  });
  it('should have remove method', () => {
    expect(typeof controller.remove).toBe('function');
  });
  it('should have findByUser method', () => {
    expect(typeof controller.findByUser).toBe('function');
  });
  it('should have findByCiclo method', () => {
    expect(typeof controller.findByCiclo).toBe('function');
  });
  it('should have findOne method', () => {
    expect(typeof controller.findOne).toBe('function');
  });
  it('should have getCycleStatistics method', () => {
    expect(typeof controller.getCycleStatistics).toBe('function');
  });
  it('should have getUserPerformanceSummary method', () => {
    expect(typeof controller.getUserPerformanceSummary).toBe('function');
  });
  it('should have getUserPerformanceSummaryByCiclo method', () => {
    expect(typeof controller.getUserPerformanceSummaryByCiclo).toBe('function');
  });
});
