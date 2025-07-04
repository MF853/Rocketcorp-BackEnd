import { Test, TestingModule } from '@nestjs/testing';
import { TrilhaService } from './trilha.service';

describe('TrilhaService', () => {
  let service: TrilhaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrilhaService],
    }).compile();

    service = module.get<TrilhaService>(TrilhaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
