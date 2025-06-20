import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Injectable()
export class AvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova avaliação.
   * Primeiro cria a AvaliacaoAbstrata, depois vincula à Avaliacao.
   */
  async create(createAvaliacaoDto: CreateAvaliacaoDto) {
    // Cria AvaliacaoAbstrata primeiro
    const avaliacaoAbstrata = await this.prisma.avaliacaoAbstrata.create({
      data: createAvaliacaoDto.avaliacaoAbstrata,
    });
    // Cria Avaliacao vinculada
    return this.prisma.avaliacao.create({
      data: {
        justificativa: createAvaliacaoDto.justificativa,
        criterio: createAvaliacaoDto.criterio,
        avaliacaoAbstrataId: avaliacaoAbstrata.id,
      },
      include: { avaliacaoAbstrata: true },
    });
  }

  /**
   * Retorna todas as avaliações cadastradas, incluindo os dados da AvaliacaoAbstrata.
   */
  findAll() {
    return this.prisma.avaliacao.findMany({ include: { avaliacaoAbstrata: true } });
  }

  /**
   * Busca uma avaliação pelo ID, incluindo os dados da AvaliacaoAbstrata.
   */
  findOne(id: number) {
    return this.prisma.avaliacao.findUnique({
      where: { id },
      include: { avaliacaoAbstrata: true },
    });
  }

  /**
   * Atualiza uma avaliação e, se necessário, a AvaliacaoAbstrata vinculada.
   */
  async update(id: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    // Atualiza Avaliacao e, se necessário, AvaliacaoAbstrata
    const avaliacao = await this.prisma.avaliacao.update({
      where: { id },
      data: {
        justificativa: updateAvaliacaoDto.justificativa,
        criterio: updateAvaliacaoDto.criterio,
      },
      include: { avaliacaoAbstrata: true },
    });
    if (updateAvaliacaoDto.avaliacaoAbstrata) {
      await this.prisma.avaliacaoAbstrata.update({
        where: { id: avaliacao.avaliacaoAbstrataId },
        data: updateAvaliacaoDto.avaliacaoAbstrata,
      });
    }
    return this.findOne(id);
  }

  /**
   * Remove uma avaliação pelo ID.
   */
  remove(id: number) {
    return this.prisma.avaliacao.delete({ where: { id } });
  }
}
