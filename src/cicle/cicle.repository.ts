import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

import { UpdateCicleDto } from "./dto/update-cicle.dto";

@Injectable()
export class CicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ciclo.findMany();
  }

  async findByStatus(status: string) {
    return this.prisma.ciclo.findFirst({ where: { status } });
  }

  async findById(id: number) {
    return this.prisma.ciclo.findUnique({
      where: { id },
    });
  }

  async create(createCicleDto: any) {
    await this.prisma.ciclo.create({
      data: {
        name: createCicleDto.name,
        year: Number(createCicleDto.year),
        period: Number(createCicleDto.period),
        status: createCicleDto.status,
      },
    });
  }

  async findByYearAndPeriod(year: number, period: number) {
    return this.prisma.ciclo.findUnique({
      where: {
        year_period: { year, period },
      },
    });
  }

  async update(id: number, data: UpdateCicleDto) {
    return this.prisma.ciclo.update({
      where: { id },
      data: {
        name: data.name,
        year: data.year ? Number(data.year) : undefined,
        period: data.period ? Number(data.period) : undefined,
        status: data.status,
      },
    });
  }
}
