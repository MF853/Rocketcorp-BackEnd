import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { UsersService } from '../users/users.service';
import { ReferenciaService } from 'src/referencia/referencia.service';
import { CicleService } from 'src/cicle/cicle.service';

@Injectable()
export class ExcelService {
  constructor(private readonly usersService: UsersService, private readonly referenciaService: ReferenciaService, private readonly cicleService: CicleService) {}

  // async processExcel(filePath: string) {
  async processExcel(buffer: Buffer) {
    const workbook = new ExcelJS.Workbook();
    // await workbook.xlsx.readFile(filePath);
    await workbook.xlsx.load(buffer);

    const perfilSheet = workbook.getWorksheet('Perfil');
    const autoSheet = workbook.getWorksheet('Autoavaliação');
    const avaliacao360Sheet = workbook.getWorksheet('Avaliação 360');
    const referenciasSheet = workbook.getWorksheet('Pesquisa de Referências');

    let userId: number | undefined;
    let cicleId: number | undefined;

    if (perfilSheet) {
      userId = await this.importPerfil(perfilSheet);
      const cicle = this.getCicle(perfilSheet);
      cicleId = (await this.cicleService.findOrCreateByString(cicle)).id;
    }

    // if (autoSheet) await this.importAutoavaliacao(autoSheet);
    // if (avaliacao360Sheet) await this.importAvaliacao360(avaliacao360Sheet);

    if (referenciasSheet && userId !== undefined && cicleId !== undefined) {
      await this.importReferencias(referenciasSheet, userId, cicleId);
    }

    return { message: 'Importação concluída com sucesso' };
  }

  private async importPerfil(sheet: ExcelJS.Worksheet): Promise<number> {
    const row = sheet.getRow(2);
    const values = row.values as any[];
  
    const name = values[1];
    const email = values[2];
    const mentorId = null;
    const unidade = values[4];
    const trilhaId = null;
    
    const existingUser = await this.usersService.findByEmail(email);
    if(existingUser){
      return existingUser.id;
    }

    const userData = {
      name,
      email,
      unidade,
      password: '123456',
      role: 'user',
      mentorId,
      trilhaId,
    };
  
    const newUser = await this.usersService.create(userData);
    console.log(newUser.id);
    return newUser.id;
  }
  
  private getCicle(perfilSheet: ExcelJS.Worksheet): string {
    const dataRow = perfilSheet.getRow(2); 
    const cicloCell = dataRow.getCell(3);
  
    const cicloValue = cicloCell?.value;
  
    if (!cicloValue || (typeof cicloValue !== 'string' && typeof cicloValue !== 'number')) {
      throw new Error('Ciclo ID inválido ou não encontrado na planilha Perfil.');
    }
  
    const cicloString = String(cicloValue).trim();
  
    return cicloString;
  }

  async importAutoavaliacao(sheet: ExcelJS.Worksheet) {
    // Implementar lógica para importar autoavaliações
  }

  async importAvaliacao360(sheet: ExcelJS.Worksheet) {
    // Implementar lógica para importar avaliações 360
  }

  async importReferencias(sheet: ExcelJS.Worksheet, userId: number, cicleId: number) {
    sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (rowNumber === 1) return; 

      const values = row.values as any[];
      const email = values[1];
      const justificativa = values[2];
      
      console.log(email);
      const existingUser = await this.usersService.findByEmail(email);

      const referenciaData = {
        idReferenciador: userId,
        idReferenciado: existingUser.id,
        justificativa: justificativa,
        idCiclo: cicleId
      };
  
      await this.referenciaService.create(referenciaData);
      
    });
  }

}
