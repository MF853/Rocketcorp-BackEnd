import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';

@Injectable()
export class EquipeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEquipeDto) {
    const equipe = await this.prisma.equipe.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        idGestor: data.idGestor,
      },
    });
    // Se membros foram informados, associe-os à equipe e atualize gestorId
    if (data.membros && data.membros.length > 0) {
      await this.prisma.user.updateMany({
        where: { id: { in: data.membros } },
        data: { idEquipe: equipe.id, gestorId: equipe.idGestor },
      });
    }
    return equipe;
  }

  async findAll() {
    return this.prisma.equipe.findMany({
      include: { gestor: true, membros: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.equipe.findUnique({
      where: { id },
      include: { gestor: true, membros: true },
    });
  }

  async update(id: number, data: UpdateEquipeDto) {
    const equipe = await this.prisma.equipe.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        idGestor: data.idGestor,
      },
    });
    // Se membros foram informados, associe-os à equipe e atualize gestorId
    if (data.membros) {
      // Adiciona gestorId aos novos membros
      await this.prisma.user.updateMany({
        where: { id: { in: data.membros } },
        data: { idEquipe: equipe.id, gestorId: equipe.idGestor },
      });
      // Remove gestorId dos que saíram da equipe
      await this.prisma.user.updateMany({
        where: { idEquipe: equipe.id, id: { notIn: data.membros } },
        data: { idEquipe: null, gestorId: null },
      });
    }
    return equipe;
  }

  async remove(id: number) {
    return this.prisma.equipe.delete({ where: { id } });
  }

  async findByGestorId(gestorId: number) {
    return this.prisma.equipe.findMany({
      where: { idGestor: gestorId },
      include: {
        membros: true,
      },
    });
  }
} 