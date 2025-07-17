import { Controller, Post, Get, Query, Res, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiQuery } from "@nestjs/swagger";
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { CicleService } from 'src/cicle/cicle.service';

@ApiTags("Docs")
@Controller('docs')
export class ExcelController {
  constructor(private readonly excelService: ExcelService, 
              private readonly userService: UsersService,
              private readonly cicleService: CicleService) {}

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

  @ApiOperation({ summary: 'Exporta planilha de autoavaliações para Excel' })
  @ApiResponse({ status: 200, description: 'Planilha exportada com sucesso.' })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  @ApiQuery({ name: 'cicleId', required: true, type: Number })
  @Get()
  async exportExcel(
    @Query('userId') userId: number,
    @Query('cicleId') cicleId: number,
    @Res() res: Response,
  ) {
    const buffer = await this.excelService.exportExcel(userId, cicleId);

    const userName = (await this.userService.findOne(userId)).name;
    const cicle = await (await this.cicleService.findOne(cicleId)).name;

    const fileName = `${userName}_${cicle}.xlsx`

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return res.send(buffer);
  }
  
}
