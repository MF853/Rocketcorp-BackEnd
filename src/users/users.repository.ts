import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

const userInclude = {
  mentor: { select: { id: true, name: true, email: true } },
  mentorados: { select: { id: true, name: true, email: true } },
  trilha: { select: { id: true, name: true } },
};


@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.user.create({
      data
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: this.getUserIncludes(),
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: this.getUserIncludes(),
    });
  }

  async findMentorados(mentorId: number) {
    return this.prisma.user.findMany({
      where: { mentorId },
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
  }

  async findByTrilha(trilhaId: number) {
    return this.prisma.user.findMany({
      where: { trilhaId },
      include: this.getUserIncludes(),
      orderBy: { name: "asc" },
    });
  }

  async update(id: number, data: Partial<Omit<Prisma.UserUpdateInput, "id" | "email" | "createdAt" | "updatedAt">>) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: this.getUserIncludes(),
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  private getUserIncludes() {
    return userInclude;
  }
} 