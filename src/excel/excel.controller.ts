import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { File as MulterFile } from 'multer';
import { BadRequestException } from '@nestjs/common';

@Controller('import')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: MulterFile) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // return this.excelService.processExcel(file.path);
    return this.excelService.processExcel(file.buffer);
  }
}
