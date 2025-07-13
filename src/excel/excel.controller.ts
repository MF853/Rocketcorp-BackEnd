import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { File as MulterFile } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from "@nestjs/swagger";

@ApiTags("Import")
@Controller('import')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @ApiOperation({ summary: "Importa um arquivo excel" })
  @ApiResponse({ status: 200, description: "Excel importado com sucesso." })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo Excel (.xlsx)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
