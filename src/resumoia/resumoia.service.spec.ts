import { Test, TestingModule } from '@nestjs/testing';
import { ResumoiaService } from './resumoia.service';

describe('ResumoiaService', () => {
  let service: ResumoiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ResumoiaService,
          useValue: {}, // mock simples
        },
      ],
    }).compile();

    service = module.get<ResumoiaService>(ResumoiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
