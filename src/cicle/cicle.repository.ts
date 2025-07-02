import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";


@Injectable()
export class CicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ciclo.findMany();
  }  

  async findById(id: number) {
    return this.prisma.ciclo.findUnique({
        where: {id}
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
  
}