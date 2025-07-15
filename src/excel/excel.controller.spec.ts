import { Test, TestingModule } from '@nestjs/testing';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

describe('ExcelController', () => {
  let controller: ExcelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelController],
      providers: [
        {
          provide: ExcelService,
          useValue: {}, // mock simples
        },
      ],
    }).compile();

    controller = module.get<ExcelController>(ExcelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have importExcel method', () => {
    expect(typeof controller.importExcel).toBe('function');
  });
}); 