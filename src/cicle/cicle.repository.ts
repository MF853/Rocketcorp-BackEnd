import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Ciclo } from "@prisma/client";
import { UpdateCicleDto } from "./dto/update-cicle.dto";
import { CreateCicleDto } from "./dto/create-cicle.dto";

@Injectable()
export class CicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Ciclo[]> {
    return this.prisma.ciclo.findMany();
  }

  async findByStatus(status: string) {
    return this.prisma.ciclo.findFirst({ where: { status } });
  }

  async findById(id: number): Promise<Ciclo> {
    const ciclo = await this.prisma.ciclo.findUnique({ where: { id } });
    if (!ciclo) {
      throw new NotFoundException(`Ciclo com id ${id} não encontrado.`);
    }
    return ciclo;
  }

  async create(data: CreateCicleDto): Promise<Ciclo> {
    return this.prisma.ciclo.create({
      data: {
        name: data.name,
        year: Number(data.year),
        period: Number(data.period),
        status: data.status,
      },
    });
  }

  async findByYearAndPeriod(year: number, period: number): Promise<Ciclo> {
    const ciclo = await this.prisma.ciclo.findUnique({
      where: {
        year_period: { year, period },
      },
    });

    if (!ciclo) {
      throw new NotFoundException(
        `Ciclo com ano ${year} e período ${period} não encontrado.`
      );
    }

    return ciclo;
  }

  async update(id: number, data: UpdateCicleDto): Promise<Ciclo> {
    await this.findById(id); // Garante que existe antes de atualizar
    return this.prisma.ciclo.update({
      where: { id },
      data: {
        name: data.name,
        year: data.year !== undefined ? Number(data.year) : undefined,
        period: data.period !== undefined ? Number(data.period) : undefined,
        status: data.status,
      },
    });
  }
}
