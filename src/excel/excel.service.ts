import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExcelService {
  constructor(private readonly usersService: UsersService) {}

  // async processExcel(filePath: string) {
  async processExcel(buffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    // await workbook.xlsx.readFile(filePath);
    await workbook.xlsx.load(buffer);

    const perfilSheet = workbook.getWorksheet('Perfil');
    const autoSheet = workbook.getWorksheet('Autoavaliação');
    const avaliacao360Sheet = workbook.getWorksheet('Avaliação 360');
    const referenciasSheet = workbook.getWorksheet('Pesquisa de Referências');

    if (perfilSheet) await this.importPerfil(perfilSheet);
    if (autoSheet) await this.importAutoavaliacao(autoSheet);
    if (avaliacao360Sheet) await this.importAvaliacao360(avaliacao360Sheet);
    if (referenciasSheet) await this.importReferencias(referenciasSheet);

    return { message: 'Importação concluída com sucesso' };
  }

  async importPerfil(sheet: ExcelJS.Worksheet) {
    let firstUserCreated = false;
  
    sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (firstUserCreated || rowNumber === 1) return; // Pula cabeçalho e para após o primeiro
  
      const values = row.values as any[];
  
      const name = values[1];
      const email = values[2];
      const mentorId = null;
      const unidade = values[4];
      const trilhaId = values[5] ? Number(values[5]) : null;
  
      const userData = {
        name,
        email,
        unidade,
        password: '123456',
        role: 'user',
        mentorId,
        trilhaId,
      };
  
      console.log(userData);
      await this.usersService.create(userData);
      firstUserCreated = true;
    });
  }

  async importAutoavaliacao(sheet: ExcelJS.Worksheet) {
    // Implementar lógica para importar autoavaliações
  }

  async importAvaliacao360(sheet: ExcelJS.Worksheet) {
    // Implementar lógica para importar avaliações 360
  }

  async importReferencias(sheet: ExcelJS.Worksheet) {
    // Implementar lógica para importar referências
  }

}
