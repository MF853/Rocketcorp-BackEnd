import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { UsersService } from '../users/users.service';
import { ReferenciaService } from 'src/referencia/referencia.service';
import { CicleService } from 'src/cicle/cicle.service';
import { AvaliacaoService } from 'src/avaliacao/avaliacao.service';
import { MotivacaoTrabalhoNovamente } from '../avaliacao/dto/create-avaliacao.dto';;

@Injectable()
export class ExcelService {
  constructor(private readonly usersService: UsersService, private readonly referenciaService: ReferenciaService, private readonly cicleService: CicleService, private readonly avaliacao360Service: AvaliacaoService) {}

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
   
    // if (avaliacao360Sheet && userId !== undefined && cicleId !== undefined) {
    //   await this.importAvaliacao360(avaliacao360Sheet, userId, cicleId);
    // }

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

  // async importAvaliacao360(sheet: ExcelJS.Worksheet, userId: number, cicleId: number) {

  //   const motivacaoMap: Record<string, MotivacaoTrabalhoNovamente> = {
  //     'Discordo Totalmente': MotivacaoTrabalhoNovamente.DISCORDO_TOTALMENTE,
  //     'Discordo Parcialmente': MotivacaoTrabalhoNovamente.DISCORDO_PARCIALMENTE,
  //     'Indiferente': MotivacaoTrabalhoNovamente.INDIFERENTE,
  //     'Concordo Parcialmente': MotivacaoTrabalhoNovamente.CONCORDO_PARCIALMENTE,
  //     'Concordo Totalmente': MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
  //   };

  //   sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
  //     if (rowNumber === 1) return; 

  //     const values = row.values as any[];
  //     const email = values[1];
  //     const project = values[2];
  //     const period = Number(values[3]);
  //     const workAgain = values[4];
  //     const grade = values[5];
  //     const weakPoint = values[6];
  //     const strengthPoint = values[7];

  //     const avaliadoUser = await this.usersService.findByEmail(email);

  //     const mappedWorkAgain = motivacaoMap[String(workAgain).trim()];

  //     const avaliacao360Data = {
  //       idAvaliador: userId,   
  //       idAvaliado: avaliadoUser.id,
  //       idCiclo: cicleId,       
  //       nota: grade,          
  //       pontosFortes: strengthPoint,  
  //       pontosMelhora: weakPoint, 
  //       nomeProjeto: project,   
  //       periodoMeses: period,  
  //       trabalhariaNovamente: mappedWorkAgain,
  //     };
  
  //     await this.avaliacao360Service.create360(avaliacao360Data);
      
  //   });
  // }

  async importReferencias(sheet: ExcelJS.Worksheet, userId: number, cicleId: number) {
    sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (rowNumber === 1) return; 

      const values = row.values as any[];
      const email = values[1];
      const justificativa = values[2];
      
      const referenciadoUser = await this.usersService.findByEmail(email);

      if (!referenciadoUser) {
        console.warn(`Usuário com email ${email} não encontrado. Operação abortada`);
        return; // ou continue para ignorar essa linha
      }

      const referenciaData = {
        idReferenciador: userId,
        idReferenciado: referenciadoUser.id,
        justificativa: justificativa,
        idCiclo: cicleId
      };
  
      await this.referenciaService.create(referenciaData);
      
    });
  }

}
