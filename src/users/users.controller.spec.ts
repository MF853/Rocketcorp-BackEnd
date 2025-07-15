import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {}, // mock simples
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have findAll method', () => {
    expect(typeof controller.findAll).toBe('function');
  });

  it('should have findOne method', () => {
    expect(typeof controller.findOne).toBe('function');
  });

  it('should have findByEmail method', () => {
    expect(typeof controller.findByEmail).toBe('function');
  });

  it('should have findMentorados method', () => {
    expect(typeof controller.findMentorados).toBe('function');
  });

  it('should have findByTrilha method', () => {
    expect(typeof controller.findByTrilha).toBe('function');
  });

  it('should have findByEquipe method', () => {
    expect(typeof controller.findByEquipe).toBe('function');
  });

  it('should have update method', () => {
    expect(typeof controller.update).toBe('function');
  });

  it('should have remove method', () => {
    expect(typeof controller.remove).toBe('function');
  });

  it('should have getUserStatistics method', () => {
    expect(typeof controller.getUserStatistics).toBe('function');
  });

  it('should have getAllUsersStatisticsByCycle method', () => {
    expect(typeof controller.getAllUsersStatisticsByCycle).toBe('function');
  });

  it('should have getMembrosAndGestorByEquipe method', () => {
    expect(typeof controller.getMembrosAndGestorByEquipe).toBe('function');
  });
}); 