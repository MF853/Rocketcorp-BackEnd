import { Injectable } from "@nestjs/common";
import { ResumoiaRepository } from "./resumoia.repository";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ResumoiaService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly repository: ResumoiaRepository,
    private readonly config: ConfigService
  ) {
    const apiKey = this.config.get<string>("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }
  async gerarResumosParaCiclo(idCiclo: number) {
    const usuarios = await this.repository.findUsersWithAvaliacoes(idCiclo);

    for (const user of usuarios) {
      const jaExiste = await this.repository.resumoAlreadyExists(
        user.id,
        idCiclo
      );
      if (jaExiste) continue;

      const avaliacoes = [
        ...user.avaliacoesRecebidas.map(
          (a) => `Nota: ${a.nota ?? "N/A"}. Justificativa: ${a.justificativa}`
        ),
        ...user.avaliacoes360Recebidas.map(
          (a) =>
            `Nota: ${a.nota ?? "N/A"}. Fortes: ${a.pontosFortes}. Melhorar: ${
              a.pontosMelhora
            }. Projeto: ${a.nomeProjeto}.`
        ),
      ].filter(Boolean);

      if (avaliacoes.length < 2) continue;

      const prompt = this.montarPrompt(user.name, avaliacoes);
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const texto = response
          .text()
          .replace(/```(\w+)?/g, "")
          .trim();

        await this.repository.createResumo(user.id, idCiclo, texto);
      } catch (e) {
        console.error(
          `Erro ao gerar resumo para ${user.name} (ciclo ${idCiclo})`,
          e
        );
      }
    }
  }

  private montarPrompt(nome: string, avaliacoes: string[]): string {
    return `
Você é um assistente de RH. Seu papel é ler múltiplas avaliações sobre um colaborador e gerar um resumo claro, neutro e objetivo.

Colaborador: ${nome}

Avaliações recebidas:
${avaliacoes.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Instruções:
- Destaque pontos fortes, oportunidades de melhoria e uma síntese final.
- Use no máximo 3 parágrafos.
- Escreva em português formal, sem citar nomes ou julgamentos subjetivos.
`;
  }
}
