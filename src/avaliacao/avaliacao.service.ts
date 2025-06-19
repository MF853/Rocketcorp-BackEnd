import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Injectable()
export class AvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

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

  findAll() {
    return this.prisma.avaliacao.findMany({ include: { avaliacaoAbstrata: true } });
  }

  findOne(id: number) {
    return this.prisma.avaliacao.findUnique({
      where: { id },
      include: { avaliacaoAbstrata: true },
    });
  }

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

  remove(id: number) {
    return this.prisma.avaliacao.delete({ where: { id } });
  }
}
