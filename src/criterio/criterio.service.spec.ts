import { Test, TestingModule } from '@nestjs/testing';
import { CriterioService } from './criterio.service';

describe('CriterioService', () => {
  let service: CriterioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CriterioService],
    }).compile();

    service = module.get<CriterioService>(CriterioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
