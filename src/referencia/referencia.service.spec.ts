import { Test, TestingModule } from '@nestjs/testing';
import { ReferenciaService } from './referencia.service';

describe('ReferenciaService', () => {
  let service: ReferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferenciaService],
    }).compile();

    service = module.get<ReferenciaService>(ReferenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
