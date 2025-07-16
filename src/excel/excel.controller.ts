import { Controller, Post, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from "@nestjs/swagger";

@ApiTags("Docs")
@Controller('docs')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @ApiOperation({ summary: "Importa um arquivo excel" })
  @ApiResponse({ status: 200, description: "Excel importado com sucesso." })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivos Excel (.xlsx)',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FilesInterceptor('files', 15))
  async importExcel(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    for (const file of files) {
      await this.excelService.importExcel(file.buffer);
    }

    return { message: 'Importação concluída com sucesso' };
  }
}
