/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import { CreateEqualizacaoDto } from "./dto/create-equalizacao.dto";
import { UpdateEqualizacaoDto } from "./dto/update-equalizacao.dto";
import { StatusEqualizacao, Equalizacao } from "@prisma/client";
import { CryptoService } from "../crypto/crypto.service";

interface DecryptedEqualizacao
  extends Omit<
    Equalizacao,
    | "mediaAutoavaliacao"
    | "mediaAvaliacaoGestor"
    | "mediaAvaliacao360"
    | "notaFinal"
    | "justificativa"
  > {
  mediaAutoavaliacao: number;
  mediaAvaliacaoGestor: number;
  mediaAvaliacao360: number;
  notaFinal: number;
  justificativa: string;
}

@Injectable()
export class EqualizacaoRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService
  ) {}

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

    // Use Promise.all to handle async map properly
    return Promise.all(
      users.map(async (user) => {
        let existingEqualizacao = user.equalizacoesRecebidas.find(
          (eq) => eq.idAvaliado === user.id && eq.idCiclo === idCiclo
        );

        if (existingEqualizacao) {
          existingEqualizacao = await this.cryptoService.decryptObject(
            existingEqualizacao
          );
        }

        // Decrypt the resumoIA if it exists
        const decryptedResumoIA = user.ResumoIA?.[0]?.resumo
          ? await this.cryptoService.decrypt(user.ResumoIA[0].resumo)
          : "";

        return {
          user: {
            id: user.id,
            name: user.name,
            cargo: user.cargo || "Desenvolvedor",
            resumoIA: decryptedResumoIA,
          },
          existingEqualizacao,
          idCiclo,
        };
      })
    );
  }

  async findByUserAndCycle(idAvaliado: number, idCiclo: number) {
    return await this.prisma.equalizacao.findUnique({
      where: {
        idAvaliado_idCiclo: {
          idAvaliado,
          idCiclo,
        },
      },
    });
  }

  async createEqualizacao(
    createEqualizacaoDto: CreateEqualizacaoDto,
    mediaAutoavaliacao: string,
    mediaAvaliacaoGestor: string,
    mediaAvaliacao360: string,
    notaFinalEncrypted: string
  ): Promise<EqualizacaoResponseDto> {
    const createdEqualizacao = await this.prisma.equalizacao.create({
      data: {
        idAvaliador: createEqualizacaoDto.idAvaliador,
        idAvaliado: createEqualizacaoDto.idAvaliado,
        idCiclo: createEqualizacaoDto.idCiclo,
        mediaAutoavaliacao: mediaAutoavaliacao,
        mediaAvaliacaoGestor: mediaAvaliacaoGestor,
        mediaAvaliacao360: mediaAvaliacao360,
        notaFinal: notaFinalEncrypted,
        justificativa: createEqualizacaoDto.justificativa,
        status: StatusEqualizacao.FINALIZADO,
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

    // Decrypt the resumo if it exists
    const decryptedResumo = resumoIA?.resumo
      ? await this.cryptoService.decrypt(resumoIA.resumo)
      : "";

    // Decrypt the nota fields
    const decryptedEqualizacao = (await this.cryptoService.decryptObject(
      createdEqualizacao
    )) as unknown as DecryptedEqualizacao;

    return {
      idEqualizacao: decryptedEqualizacao.id.toString(),
      idAvaliador: decryptedEqualizacao.idAvaliador.toString(),
      idAvaliado: decryptedEqualizacao.idAvaliado.toString(),
      idCiclo: decryptedEqualizacao.idCiclo.toString(),
      nomeAvaliado: "Nome Avaliado", // Placeholder
      cargoAvaliado: "Desenvolvedor", // Placeholder
      notaAutoavaliacao: decryptedEqualizacao.mediaAutoavaliacao,
      notaGestor: decryptedEqualizacao.mediaAvaliacaoGestor,
      notaAvaliacao360: decryptedEqualizacao.mediaAvaliacao360,
      notaFinal: decryptedEqualizacao.notaFinal,
      justificativa: decryptedEqualizacao.justificativa,
      resumoIA: decryptedResumo,
      status: "Finalizado" as "Finalizado" | "Pendente",
    };
  }

  async updateEqualizacao(
    id: number,
    updateEqualizacaoDto: UpdateEqualizacaoDto
  ): Promise<EqualizacaoResponseDto> {
    const dataToUpdate: { notaFinal?: string; justificativa?: string } = {};

    if (updateEqualizacaoDto.notaFinal !== undefined) {
      dataToUpdate.notaFinal = await this.cryptoService.encrypt(
        updateEqualizacaoDto.notaFinal.toString()
      );
    }
    if (updateEqualizacaoDto.justificativa !== undefined) {
      dataToUpdate.justificativa = updateEqualizacaoDto.justificativa;
    }

    const updatedEqualizacao = await this.prisma.equalizacao.update({
      where: { id },
      data: dataToUpdate,
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

    // Decrypt the resumo if it exists
    const decryptedResumo = resumoIA?.resumo
      ? await this.cryptoService.decrypt(resumoIA.resumo)
      : "";

    const decryptedUpdatedEqualizacao = (await this.cryptoService.decryptObject(
      updatedEqualizacao
    )) as unknown as DecryptedEqualizacao;

    return {
      idEqualizacao: decryptedUpdatedEqualizacao.id.toString(),
      idAvaliador: decryptedUpdatedEqualizacao.idAvaliador.toString(),
      idAvaliado: decryptedUpdatedEqualizacao.idAvaliado.toString(),
      idCiclo: decryptedUpdatedEqualizacao.idCiclo.toString(),
      nomeAvaliado: "Nome Avaliado", // Placeholder
      cargoAvaliado: "Desenvolvedor", // Placeholder
      notaAutoavaliacao: decryptedUpdatedEqualizacao.mediaAutoavaliacao,
      notaGestor: decryptedUpdatedEqualizacao.mediaAvaliacaoGestor,
      notaAvaliacao360: decryptedUpdatedEqualizacao.mediaAvaliacao360,
      notaFinal: decryptedUpdatedEqualizacao.notaFinal,
      justificativa: decryptedUpdatedEqualizacao.justificativa,
      resumoIA: decryptedResumo,
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
