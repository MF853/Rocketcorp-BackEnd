import { Test, TestingModule } from '@nestjs/testing';
import { ReferenciaController } from './referencia.controller';
import { ReferenciaService } from './referencia.service';

describe('ReferenciaController', () => {
  let controller: ReferenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenciaController],
      providers: [ReferenciaService],
    }).compile();

    controller = module.get<ReferenciaController>(ReferenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
