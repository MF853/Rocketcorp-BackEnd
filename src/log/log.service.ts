import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(params: {
    userId: number | undefined;
    action: string;
    entity: string;
    // data: any; // Removido
  }) {
    const { userId, action, entity } = params;
    if (!userId) {
      // Não cria log se userId não estiver definido
      console.warn('Tentativa de log sem userId:', { action, entity });
      return;
    }
    return this.prisma.log.create({
      data: {
        userId,
        action,
        entity,
      },
    });
  }

  async getRecentLogs() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return this.prisma.log.findMany({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
} 