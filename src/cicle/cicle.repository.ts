import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";


@Injectable()
export class CicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ciclo.findMany();
  }  
}