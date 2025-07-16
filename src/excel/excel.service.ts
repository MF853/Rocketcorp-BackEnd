import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { UsersService } from '../users/users.service';
import { ReferenciaService } from 'src/referencia/referencia.service';
import { CicleService } from 'src/cicle/cicle.service';
import { AvaliacaoService } from 'src/avaliacao/avaliacao.service';
import { MotivacaoTrabalhoNovamente } from '../avaliacao/dto/create-avaliacao.dto';
import { CriterioService } from 'src/criterio/criterio.service';
import { Criterio } from '@prisma/client';
import { mapTipoCriterio } from 'src/criterio/helpers/map.tipo.criterios';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class ExcelService {
  constructor(private readonly usersService: UsersService, 
              private readonly referenciaService: ReferenciaService, 
              private readonly cicleService: CicleService, 
              private readonly avaliacaoService: AvaliacaoService,
              private readonly criterioService: CriterioService,
              private readonly cryptoService: CryptoService) {}

  // async processExcel(filePath: string) {
  async importExcel(buffer: Buffer) {
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

    if (autoSheet && userId !== undefined && cicleId !== undefined) {
      await this.importAutoavaliacao(autoSheet, userId, cicleId);
    }

    if (avaliacao360Sheet && userId !== undefined && cicleId !== undefined) {
      await this.importAvaliacao360(avaliacao360Sheet, userId, cicleId);
    }

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

  private async importAutoavaliacao(sheet: ExcelJS.Worksheet, userId: number, cicleId: number) {
    // Implementar lógica para importar autoavaliações
    const criteria: Criterio[] = await this.criterioService.findByCicloId(cicleId);

    sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (rowNumber === 1) return; 

      const values = row.values as any[];
      const criterion = values[1];
      const criterionDescription = values[2];
      const grade = values[3];
      const justification = values[5];
      const criterionType = mapTipoCriterio(criterion); 

      if (typeof grade === "string" && grade.trim().toUpperCase() === 'NA') {
        console.warn(`Linha ${rowNumber} pulada: justificativa = NA`);
        return;
      }

      let existingCriteria = criteria.find(c =>
        c.name.trim().toLowerCase() === criterion.toLowerCase()
      );

      if (!existingCriteria) {
        const criteriaData = {
          name: criterion,
          tipo: criterionType,
          description: criterionDescription,
          idCiclo: cicleId,
          trilhaId: 1
          }
        existingCriteria = await this.criterioService.create(criteriaData);
      }

      const criteriaId = existingCriteria?.id

      const autoAvaliacaoData = {
        idUser: userId,   
        idCiclo: cicleId,       
        nota: grade,     
        justificativa: justification,
        criterioId: criteriaId
      };
  
      await this.avaliacaoService.create(autoAvaliacaoData);
      
    });
  }

  private async importAvaliacao360(sheet: ExcelJS.Worksheet, userId: number, cicleId: number) {

    const motivacaoMap: Record<string, MotivacaoTrabalhoNovamente> = {
      'Discordo Totalmente': MotivacaoTrabalhoNovamente.DISCORDO_TOTALMENTE,
      'Discordo Parcialmente': MotivacaoTrabalhoNovamente.DISCORDO_PARCIALMENTE,
      'Indiferente': MotivacaoTrabalhoNovamente.INDIFERENTE,
      'Concordo Parcialmente': MotivacaoTrabalhoNovamente.CONCORDO_PARCIALMENTE,
      'Concordo Totalmente': MotivacaoTrabalhoNovamente.CONCORDO_TOTALMENTE,
    };

    sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (rowNumber === 1) return; 

      const values = row.values as any[];
      const email = values[1];
      const project = values[2];
      const period = Number(values[3]);
      const workAgain = values[4];
      const grade = values[5];
      const weakPoint = values[6];
      const strengthPoint = values[7];

      const avaliadoUser = await this.usersService.findByEmail(email);

      if (!avaliadoUser) {
        console.warn(`Usuário com email ${email} não encontrado. Operação abortada`);
        return; // ou continue para ignorar essa linha
      }

      const mappedWorkAgain = motivacaoMap[String(workAgain).trim()];

      const avaliacao360Data = {
        idAvaliador: userId,   
        idAvaliado: avaliadoUser.id,
        idCiclo: cicleId,       
        nota: grade,          
        pontosFortes: strengthPoint,  
        pontosMelhora: weakPoint, 
        nomeProjeto: project,   
        periodoMeses: period,  
        trabalhariaNovamente: mappedWorkAgain,
      };
  
      await this.avaliacaoService.create360(avaliacao360Data);
      
    });
  }

  private async importReferencias(sheet: ExcelJS.Worksheet, userId: number, cicleId: number) {
    sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
      if (rowNumber === 1) return; 

      const values = row.values as any[];
      const email = values[1];
      const justificativa = values[2];
      
      const referenciadoUser = await this.usersService.findByEmail(email);

      if (!referenciadoUser) {
        console.warn(`Usuário com email ${email} não encontrado. Referencia não importada`);
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
 
  async exportExcel(userId: number, cicleId: number) {
  //Planilha PERFIL - idUser = Pegar parte dos dados dele
  //Planilha AUTOAVALIACAO - 
  //Planilha AVALIACAO360 - 
  //Planilha EQUALIZACAO - 
    const workbook = new ExcelJS.Workbook();
  
    await this.exportPerfil(workbook, userId);
    await this.exportAvaliacao(workbook, userId, cicleId);
    await this.exportAvaliacao360(workbook, userId, cicleId);
  
    // Gerar o buffer e retornar
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }


  private async exportPerfil(workbook: ExcelJS.Workbook, userId: number) {
    const sheet = workbook.addWorksheet('Perfil');

    const userData = await this.usersService.findOne(userId);
    // lógica para adicionar os dados
    sheet.columns = [
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Nome', key: 'nome', width: 30 },
      { header: 'Cargo', key: 'cargo', width: 40 },
      { header: 'Unidade', key: 'unidade', width: 40 },
    ];
    
    sheet.addRow({
      email: userData.email,
      nome: userData.name,
      cargo: userData.cargo,
      unidade: userData.unidade,
    });
  
  }
  
  private async exportAvaliacao(workbook: ExcelJS.Workbook, userId: number, cicleId: number) {
    const sheet = workbook.addWorksheet('Autoavaliacao');

    const evaluationsData = await this.avaliacaoService.getUserPerformanceSummary(userId, cicleId);
    const selfEvaluationData = evaluationsData.avaliacoesRecebidas;

    for (const item of selfEvaluationData) {
      item.justificativa = await this.cryptoService.decrypt(item.justificativa);
    }
    // lógica para adicionar os dados
    sheet.columns = [
      { header: 'Criterio', key: 'criterio', width: 30 },
      { header: 'Nota', key: 'nota', width:15 },
      { header: 'Justificativa', key: 'justificativa', width: 50 },
    ];
    
    selfEvaluationData.forEach((evaluation) => {
      sheet.addRow({
        criterio: evaluation.criterio?.name || 'NA',
        nota: evaluation.nota ?? 'NA',
        justificativa: evaluation.justificativa || 'NA',
      });
    });
    
  }

  private async exportAvaliacao360(workbook: ExcelJS.Workbook, userId: number, cicleId: number) {
    const sheet = workbook.addWorksheet('Avaliacao360_Recebidas');

    const evaluationsData = await this.avaliacaoService.getUserPerformanceSummary(userId, cicleId);
    const evaluation360Data = evaluationsData.avaliacoes360Recebidas;
    
    for (const item of evaluation360Data) {
      item.pontosFortes = await this.cryptoService.decrypt(item.pontosFortes);
      item.pontosMelhora = await this.cryptoService.decrypt(item.pontosMelhora);
    }
    // lógica para adicionar os dados
    sheet.columns = [
      { header: 'Projeto', key: 'projeto', width: 30 },
      { header: 'Periodo', key: 'periodo', width:15 },
      { header: 'Trabalharia Novamente', key: 'trabalharia_novamente', width: 50 },
      { header: 'Nota', key: 'nota', width: 15 },
      { header: 'Pontos Fortes', key: 'pontos_fortes', width: 50 },
      { header: 'Pontos Melhorar', key: 'pontos_melhorar', width: 50 },
    ];
    
    evaluation360Data.forEach((evaluation) => {
      sheet.addRow({
        projeto: evaluation.nomeProjeto || 'NA',
        periodo: evaluation.periodoMeses ?? 'NA',
        trabalharia_novamente: evaluation.trabalhariaNovamente,
        nota: evaluation.nota ?? 'NA',
        pontos_fortes: evaluation.pontosFortes || 'NA',
        pontos_melhorar: evaluation.pontosMelhora || 'NA',
      });
    });
} 

}
