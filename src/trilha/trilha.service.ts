import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CreateTrilhaDto, BulkCreateTrilhaDto } from "./dto/create-trilha.dto";
import { UpdateTrilhaDto } from "./dto/update-trilha.dto";
import { BulkUpdateTrilhaDto } from "./dto/bulk-update-trilha.dto";
import {
  TrilhaRepository,
  BulkCreateResult,
  BulkUpdateResult,
} from "./trilha.repository";

@Injectable()
export class TrilhaService {
  constructor(private readonly trilhaRepository: TrilhaRepository) {}

  async create(createTrilhaDto: CreateTrilhaDto) {
    try {
      return await this.trilhaRepository.create(createTrilhaDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw new BadRequestException(
              `Trilha com o nome "${createTrilhaDto.name}" já existe.`
            );
          default:
            throw new BadRequestException(
              "Erro ao criar trilha. Verifique os dados fornecidos."
            );
        }
      }
      throw error;
    }
  }

  async createBulk(
    bulkCreateTrilhaDto: BulkCreateTrilhaDto
  ): Promise<BulkCreateResult> {
    const { trilhas } = bulkCreateTrilhaDto;

    if (!trilhas || trilhas.length === 0) {
      throw new BadRequestException(
        "Nenhuma trilha fornecida para criação em lote."
      );
    }

    try {
      return await this.trilhaRepository.createBulk(bulkCreateTrilhaDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002": {
            const failedTrilha = trilhas.find(
              (trilha) => trilha.name && error.message.includes(trilha.name)
            );
            const trilhaName = failedTrilha?.name || "uma das trilhas";
            throw new BadRequestException(
              `Erro na criação em lote: Trilha "${trilhaName}" já existe. ` +
                "Verifique se não há nomes duplicados na lista ou no banco de dados."
            );
          }
          default:
            throw new BadRequestException(
              "Erro na criação em lote de trilhas. Verifique os dados fornecidos."
            );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.trilhaRepository.findAll();
  }

  async findAllWithUsers() {
    return await this.trilhaRepository.findAllWithUsers();
  }

  async findAllComplete() {
    return await this.trilhaRepository.findAllComplete();
  }

  async findAllWithCriterios() {
    return await this.trilhaRepository.findAllWithCriterios();
  }

  async findAllWithCriteriosGrouped() {
    const trilhas = await this.trilhaRepository.findAllWithCriterios();

    return trilhas.map((trilha) => ({
      ...trilha,
      criteriosGrouped: this.groupCriteriosByTipo(trilha.criterio || []),
      criterio: undefined, // Remove the original criterio array
    }));
  }

  async findOne(id: number) {
    const trilha = await this.trilhaRepository.findById(id);
    if (!trilha) {
      throw new NotFoundException(`Trilha com ID ${id} não encontrada.`);
    }
    return trilha;
  }

  async findOneWithUsers(id: number) {
    const trilha = await this.trilhaRepository.findByIdWithUsers(id);
    if (!trilha) {
      throw new NotFoundException(`Trilha com ID ${id} não encontrada.`);
    }
    return trilha;
  }

  async findOneComplete(id: number) {
    const trilha = await this.trilhaRepository.findByIdComplete(id);
    if (!trilha) {
      throw new NotFoundException(`Trilha com ID ${id} não encontrada.`);
    }
    return trilha;
  }

  async findOneWithCriterios(id: number) {
    const trilha = await this.trilhaRepository.findByIdWithCriterios(id);
    if (!trilha) {
      throw new NotFoundException(`Trilha com ID ${id} não encontrada.`);
    }
    return trilha;
  }

  async findOneWithCriteriosGrouped(id: number) {
    const trilha = await this.trilhaRepository.findByIdWithCriterios(id);
    if (!trilha) {
      throw new NotFoundException(`Trilha com ID ${id} não encontrada.`);
    }

    return {
      ...trilha,
      criteriosGrouped: this.groupCriteriosByTipo(trilha.criterio || []),
      criterio: undefined, // Remove the original criterio array
    };
  }

  private groupCriteriosByTipo(criterios: any[]) {
    const grouped: Record<string, any[]> = {};

    criterios.forEach((criterio: any) => {
      const tipo: string = (criterio as { tipo?: string })?.tipo || "outros";

      // If this tipo doesn't exist yet, create an empty array for it
      if (!grouped[tipo]) {
        grouped[tipo] = [];
      }

      grouped[tipo].push(criterio);
    });

    return grouped;
  }

  async update(id: number, updateTrilhaDto: UpdateTrilhaDto) {
    // Check if trilha exists
    const existingTrilha = await this.trilhaRepository.findById(id);
    if (!existingTrilha) {
      throw new NotFoundException(`Trilha com ID ${id} não encontrada.`);
    }

    try {
      return await this.trilhaRepository.update(id, updateTrilhaDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw new BadRequestException(
              `Trilha com o nome "${updateTrilhaDto.name}" já existe.`
            );
          default:
            throw new BadRequestException(
              "Erro ao atualizar trilha. Verifique os dados fornecidos."
            );
        }
      }
      throw error;
    }
  }

  async updateBulk(
    bulkUpdateTrilhaDto: BulkUpdateTrilhaDto
  ): Promise<BulkUpdateResult> {
    const { trilhas } = bulkUpdateTrilhaDto;

    if (!trilhas || trilhas.length === 0) {
      throw new BadRequestException(
        "Nenhuma trilha fornecida para atualização em lote."
      );
    }

    try {
      return await this.trilhaRepository.updateBulk(bulkUpdateTrilhaDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002": {
            const failedTrilha = trilhas.find(
              (trilha) => trilha.name && error.message.includes(trilha.name)
            );
            const trilhaName = failedTrilha?.name || "uma das trilhas";
            throw new BadRequestException(
              `Erro na atualização em lote: Trilha "${trilhaName}" já existe. ` +
                "Verifique se não há nomes duplicados na lista ou no banco de dados."
            );
          }
          default:
            throw new BadRequestException(
              "Erro na atualização em lote de trilhas. Verifique os dados fornecidos."
            );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Check if trilha exists
    const existingTrilha = await this.trilhaRepository.findById(id);
    if (!existingTrilha) {
      throw new NotFoundException(`Trilha com ID ${id} não encontrada.`);
    }

    try {
      return await this.trilhaRepository.delete(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2003":
            throw new BadRequestException(
              "Não é possível remover esta trilha pois existem usuários ou critérios vinculados a ela. " +
                "Remova as dependências primeiro ou transfira os dados para outra trilha."
            );
          default:
            throw new BadRequestException(
              "Erro ao remover trilha. Verifique se não há dependências vinculadas."
            );
        }
      }
      throw error;
    }
  }

  async count() {
    return await this.trilhaRepository.count();
  }
}
