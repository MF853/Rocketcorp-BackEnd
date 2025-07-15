import { Injectable } from "@nestjs/common";
import { ResumoiaRepository } from "./resumoia.repository";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
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
    console.log(
      `🚀 [RESUMOIA] Iniciando geração de resumos para ciclo ${idCiclo}`
    );

    const usuarios = await this.repository.findUsersWithAvaliacoes(idCiclo);
    console.log(
      `👥 [RESUMOIA] Encontrados ${usuarios.length} usuários com avaliações no ciclo ${idCiclo}`
    );

    // Process in batches to avoid overwhelming the API
    const BATCH_SIZE = 3; // Process 3 users concurrently
    const batches: (typeof usuarios)[] = [];

    for (let i = 0; i < usuarios.length; i += BATCH_SIZE) {
      batches.push(usuarios.slice(i, i + BATCH_SIZE));
    }

    console.log(
      `📦 [RESUMOIA] Processando em ${batches.length} lotes de até ${BATCH_SIZE} usuários`
    );

    let processedCount = 0;
    let errorCount = 0;

    for (const [batchIndex, batch] of batches.entries()) {
      console.log(
        `\n� [RESUMOIA] Processando lote ${batchIndex + 1}/${batches.length} (${
          batch.length
        } usuários)`
      );

      // Process batch concurrently
      const batchPromises = batch.map((user) =>
        this.processarUsuario(user, idCiclo)
      );
      const results = await Promise.allSettled(batchPromises);

      // Count results
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          processedCount++;
          console.log(
            `✅ [RESUMOIA] ${batch[index].name} processado com sucesso`
          );
        } else {
          errorCount++;
          console.error(
            `❌ [RESUMOIA] Erro ao processar ${batch[index].name}:`,
            result.status === "rejected" ? result.reason : "Usuário pulado"
          );
        }
      });

      // Small delay between batches to respect API limits
      if (batchIndex < batches.length - 1) {
        console.log(`⏳ [RESUMOIA] Aguardando 2s antes do próximo lote...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(`🎉 [RESUMOIA] Processamento concluído para ciclo ${idCiclo}`);
    console.log(
      `📊 [RESUMOIA] Estatísticas: ${processedCount} sucessos, ${errorCount} erros, ${usuarios.length} total`
    );

    return {
      total: usuarios.length,
      processed: processedCount,
      errors: errorCount,
      batches: batches.length,
    };
  }

  private async processarUsuario(
    user: Awaited<
      ReturnType<typeof this.repository.findUsersWithAvaliacoes>
    >[0],
    idCiclo: number
  ): Promise<boolean> {
    console.log(
      `📝 [RESUMOIA] Processando usuário: ${user.name} (ID: ${user.id})`
    );

    const jaExiste = await this.repository.resumoAlreadyExists(
      user.id,
      idCiclo
    );
    if (jaExiste) {
      console.log(
        `⚠️  [RESUMOIA] Resumo já existe para ${user.name}, pulando...`
      );
      return false;
    }

    const avaliacoes = [
      // Autoavaliações (self-evaluations) - evaluations the user made about themselves
      ...user.autoAvaliacoesFeitas
        .filter((a) => a.idUser === user.id && a.idCiclo === idCiclo)
        .map((a) => {
          const criterioInfo =
            a.criterio && a.criterio.name && a.criterio.tipo
              ? `${a.criterio.name} (${a.criterio.tipo})`
              : "Geral";

          let avaliacaoText = `[AUTOAVALIAÇÃO - ${criterioInfo}] Nota: ${
            a.nota ?? "N/A"
          }. "${a.justificativa}"`;

          // Add manager's feedback if available
          if (a.notaGestor !== null && a.notaGestor !== undefined) {
            avaliacaoText += ` | GESTOR: Nota: ${a.notaGestor}`;
            if (a.justificativaGestor) {
              avaliacaoText += `. "${a.justificativaGestor}"`;
            }
          }

          return avaliacaoText;
        }),

      // Avaliações 360 (360-degree evaluations) - evaluations others made about this user
      ...user.avaliacoes360Recebidas
        .filter((a) => a.idCiclo === idCiclo)
        .map(
          (a) =>
            `[360°] Nota: ${a.nota ?? "N/A"}. Fortes: "${
              a.pontosFortes
            }". Melhorar: "${a.pontosMelhora}". Projeto: "${a.nomeProjeto}".`
        ),

      // Mentoring received - evaluations from mentors
      ...user.mentoringsRecebidos
        .filter((m) => m.idCiclo === idCiclo)
        .map(
          (m) => `[MENTORING] Nota: ${m.nota ?? "N/A"}. "${m.justificativa}"`
        ),
    ].filter(Boolean);

    if (avaliacoes.length === 0) {
      console.log(
        `❌ [RESUMOIA] ${user.name} não possui avaliações no ciclo ${idCiclo}, pulando...`
      );
      return false;
    }

    console.log(
      `📊 [RESUMOIA] ${user.name} possui ${avaliacoes.length} avaliação(ões) para processar`
    );

    const prompt = this.montarPrompt(user.name, avaliacoes);
    const model = this.getConfiguredModel();

    try {
      console.log(
        `⏳ [RESUMOIA] Enviando prompt para Gemini AI para ${user.name}...`
      );
      const result = await model.generateContent(prompt);

      const response = result.response;
      const rawText = response.text();
      const texto = rawText.replace(/```(\w+)?/g, "").trim();

      if (!texto || texto.length === 0) {
        console.error(`⚠️  [RESUMOIA] Texto vazio para ${user.name}!`);
        return false;
      }

      await this.repository.createResumo(user.id, idCiclo, texto);
      console.log(
        `💾 [RESUMOIA] Resumo salvo para ${user.name} (${texto.length} chars)`
      );
      return true;
    } catch (e) {
      console.error(`❌ [RESUMOIA] Erro ao gerar resumo para ${user.name}:`, e);
      throw e;
    }
  }

  private montarPrompt(nome: string, avaliacoes: string[]): string {
    return `Analise as avaliações e gere um resumo de RH em português, máximo 800 caracteres.

Colaborador: ${nome}

Avaliações (3 tipos):
${avaliacoes.map((a, i) => `${i + 1}. ${a}`).join("\n")}

LEGENDA:
- [AUTOAVALIAÇÃO - Critério]: Percepção do colaborador sobre critério específico
- [AUTOAVALIAÇÃO - Critério] | GESTOR: Inclui feedback do gestor quando disponível
- [360°]: Avaliação multidirecional com pontos específicos
- [MENTORING]: Avaliação do mentor sobre o mentorado

Exemplo: "Maria demonstra excelente capacidade técnica conforme suas autoavaliações em Liderança e Comunicação. Destacada pelas avaliações 360° por sua gestão de projetos. Suas autoavaliações mostram autocrítica saudável sobre desenvolvimento técnico. Pontos de atenção identificados pelos colegas: necessita melhorar gestão de conflitos. Profissional comprometida com grande potencial para crescimento."

Gere apenas o resumo balanceado, sem formatação:`;
  }

  private getConfiguredModel() {
    return this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 2000, // Increased to allow for thoughts + actual response
        temperature: 0.2, // Controls randomness (0.0 = deterministic, 1.0 = very random)
        topP: 0.8, // Controls diversity via nucleus sampling
        topK: 40, // Limits the number of tokens to consider at each step
        candidateCount: 1, // Number of response candidates to return
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }
}
