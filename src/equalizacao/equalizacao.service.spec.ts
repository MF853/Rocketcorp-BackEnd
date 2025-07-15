import { Test, TestingModule } from '@nestjs/testing';
import { EqualizacaoService } from './equalizacao.service';

describe('EqualizacaoService', () => {
  let service: EqualizacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EqualizacaoService],
    }).compile();

    service = module.get<EqualizacaoService>(EqualizacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
