import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import { CreateEqualizacaoDto } from "./dto/create-equalizacao.dto";
import { UpdateEqualizacaoDto } from "./dto/update-equalizacao.dto";
import { StatusEqualizacao } from "@prisma/client";

@Injectable()
export class EqualizacaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getEqualizacoesByCycle(idCiclo: number) {
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
        equalizacoesRecebidas: {
          where: { idCiclo },
        },
      },
    });

    return users.map((user) => {
      const existingEqualizacao = user.equalizacoesRecebidas.find(
        (eq) => eq.idAvaliado === user.id && eq.idCiclo === idCiclo
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          cargo: user.cargo || "Desenvolvedor",
          resumoIA: user.ResumoIA?.[0]?.resumo || "",
        },
        existingEqualizacao,
        idCiclo,
      };
    });
  }

  async createEqualizacao(
    createEqualizacaoDto: CreateEqualizacaoDto,
    mediaAutoavaliacao: number,
    mediaAvaliacaoGestor: number,
    mediaAvaliacao360: number
  ): Promise<EqualizacaoResponseDto> {
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

    const resumoIA = await this.prisma.resumoIA.findUnique({
      where: {
        userId_idCiclo: {
          userId: createEqualizacaoDto.idAvaliado,
          idCiclo: createEqualizacaoDto.idCiclo,
        },
      },
      select: { resumo: true },
    });

    return {
      idEqualizacao: createdEqualizacao.id.toString(),
      idAvaliador: createdEqualizacao.idAvaliador.toString(),
      idAvaliado: createdEqualizacao.idAvaliado.toString(),
      idCiclo: createdEqualizacao.idCiclo.toString(),
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

  async updateEqualizacao(
    id: number,
    updateEqualizacaoDto: UpdateEqualizacaoDto
  ): Promise<EqualizacaoResponseDto> {
    const existingEqualizacao = await this.prisma.equalizacao.findUnique({
      where: { id },
      include: {
        avaliado: {
          select: { name: true, cargo: true },
        },
      },
    });

    if (!existingEqualizacao) {
      throw new Error(`Equalizacao with ID ${id} not found`);
    }

    const updatedEqualizacao = await this.prisma.equalizacao.update({
      where: { id },
      data: {
        ...(updateEqualizacaoDto.notaFinal !== undefined && {
          notaFinal: updateEqualizacaoDto.notaFinal,
        }),
        ...(updateEqualizacaoDto.justificativa !== undefined && {
          justificativa: updateEqualizacaoDto.justificativa,
        }),
      },
      include: {
        avaliado: {
          select: { name: true, cargo: true },
        },
      },
    });

    const resumoIA = await this.prisma.resumoIA.findUnique({
      where: {
        userId_idCiclo: {
          userId: updatedEqualizacao.idAvaliado,
          idCiclo: updatedEqualizacao.idCiclo,
        },
      },
      select: { resumo: true },
    });

    return {
      idEqualizacao: updatedEqualizacao.id.toString(),
      idAvaliador: updatedEqualizacao.idAvaliador.toString(),
      idAvaliado: updatedEqualizacao.idAvaliado.toString(),
      idCiclo: updatedEqualizacao.idCiclo.toString(),
      nomeAvaliado: updatedEqualizacao.avaliado.name,
      cargoAvaliado: updatedEqualizacao.avaliado.cargo || "Desenvolvedor",
      notaAutoavaliacao: updatedEqualizacao.mediaAutoavaliacao,
      notaGestor: updatedEqualizacao.mediaAvaliacaoGestor,
      notaAvaliacao360: updatedEqualizacao.mediaAvaliacao360,
      notaFinal: updatedEqualizacao.notaFinal,
      justificativa: updatedEqualizacao.justificativa,
      resumoIA: resumoIA?.resumo || "",
      status: "Finalizado" as "Finalizado" | "Pendente",
    };
  }

  async getEqualizacoesByAvaliado(idAvaliado: number) {
    const equalizacoes = await this.prisma.equalizacao.findMany({
      where: { idAvaliado },
      include: {
        avaliado: { select: { name: true, cargo: true } },
      },
    });
    // Busca os resumos IA para cada equalização
    const result = await Promise.all(
      equalizacoes.map(async (eq) => {
        const resumoIA = await this.prisma.resumoIA.findUnique({
          where: {
            userId_idCiclo: {
              userId: eq.idAvaliado,
              idCiclo: eq.idCiclo,
            },
          },
          select: { resumo: true },
        });
        return {
          ...eq,
          nomeAvaliado: eq.avaliado.name,
          cargoAvaliado: eq.avaliado.cargo || "Desenvolvedor",
          resumoIA: resumoIA?.resumo || "",
        };
      })
    );
    return result;
  }
}
