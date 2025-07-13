import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import { CreateEqualizacaoDto } from "./dto/create-equalizacao.dto";
import { StatusEqualizacao } from "@prisma/client";

@Injectable()
export class EqualizacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getEqualizacoesByCycle(
    idCiclo: number
  ): Promise<EqualizacaoResponseDto[]> {
    // Get all users with evaluations in the cycle
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            autoAvaliacoesFeitas: {
              some: { idCiclo },
            },
          },
          {
            avaliacoes360Recebidas: {
              some: { idCiclo },
            },
          },
        ],
      },
      include: {
        ResumoIA: {
          where: { idCiclo },
          select: { resumo: true },
        },
        equalizacoesRecebidas: true,
      },
    });

    return users
      .map((user) => {
        // Check if user has an existing equalizacao for this specific cycle
        const existingEqualizacao = user.equalizacoesRecebidas.find(
          (eq) => eq.idAvaliado === user.id && eq.idCiclo === idCiclo
        );

        if (existingEqualizacao) {
          // Return existing equalizacao data
          return {
            idEqualizacao: existingEqualizacao.id.toString(),
            idAvaliador: existingEqualizacao.idAvaliador.toString(),
            idAvaliado: existingEqualizacao.idAvaliado.toString(),
            nomeAvaliado: user.name,
            cargoAvaliado: user.cargo || "Desenvolvedor",
            notaAutoavaliacao: existingEqualizacao.mediaAutoavaliacao,
            notaGestor: existingEqualizacao.mediaAvaliacaoGestor,
            notaAvaliacao360: existingEqualizacao.mediaAvaliacao360,
            notaFinal: existingEqualizacao.notaFinal,
            justificativa: existingEqualizacao.justificativa,
            resumoIA: user.ResumoIA?.[0]?.resumo || "",
            status:
              existingEqualizacao.status === StatusEqualizacao.FINALIZADO
                ? "Finalizado"
                : ("Pendente" as "Finalizado" | "Pendente"),
          };
        } else {
          // Return placeholder data - will be filled by service layer
          return {
            idEqualizacao: `temp_${user.id}_${idCiclo}`,
            idAvaliador: user.id.toString(),
            idAvaliado: user.id.toString(),
            nomeAvaliado: user.name,
            cargoAvaliado: user.cargo || "Desenvolvedor",
            notaAutoavaliacao: null,
            notaGestor: null,
            notaAvaliacao360: null,
            notaFinal: null,
            justificativa: null,
            resumoIA: user.ResumoIA?.[0]?.resumo || "",
            status: "Pendente" as "Pendente" | "Finalizado",
          };
        }
      })
      .sort((a, b) => a.nomeAvaliado.localeCompare(b.nomeAvaliado));
  }

  async createEqualizacao(
    createEqualizacaoDto: CreateEqualizacaoDto,
    mediaAutoavaliacao: number,
    mediaAvaliacaoGestor: number,
    mediaAvaliacao360: number
  ): Promise<EqualizacaoResponseDto> {
    // Create the equalizacao with the provided statistics
    const createdEqualizacao = await this.prisma.equalizacao.create({
      data: {
        idAvaliador: createEqualizacaoDto.idAvaliador,
        idAvaliado: createEqualizacaoDto.idAvaliado,
        idCiclo: createEqualizacaoDto.idCiclo,
        mediaAutoavaliacao,
        mediaAvaliacaoGestor,
        mediaAvaliacao360,
        notaFinal: createEqualizacaoDto.notaFinal,
        justificativa: createEqualizacaoDto.justificativa,
        status: StatusEqualizacao.FINALIZADO,
      },
      include: {
        avaliado: {
          select: { name: true, cargo: true },
        },
      },
    });

    // Get resumo IA if exists
    const resumoIA = await this.prisma.resumoIA.findUnique({
      where: {
        userId_idCiclo: {
          userId: createEqualizacaoDto.idAvaliado,
          idCiclo: createEqualizacaoDto.idCiclo,
        },
      },
      select: { resumo: true },
    });

    // Return the EqualizacaoResponseDto format
    return {
      idEqualizacao: createdEqualizacao.id.toString(),
      idAvaliador: createdEqualizacao.idAvaliador.toString(),
      idAvaliado: createdEqualizacao.idAvaliado.toString(),
      nomeAvaliado: createdEqualizacao.avaliado.name,
      cargoAvaliado: createdEqualizacao.avaliado.cargo || "Desenvolvedor",
      notaAutoavaliacao: createdEqualizacao.mediaAutoavaliacao,
      notaGestor: createdEqualizacao.mediaAvaliacaoGestor,
      notaAvaliacao360: createdEqualizacao.mediaAvaliacao360,
      notaFinal: createdEqualizacao.notaFinal,
      justificativa: createdEqualizacao.justificativa,
      resumoIA: resumoIA?.resumo || "",
      status: "Finalizado" as "Finalizado" | "Pendente",
    };
  }
}
