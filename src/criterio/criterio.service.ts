import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  CreateCriterioDto,
  BulkCreateCriterioDto,
} from "./dto/create-criterio.dto";
import {
  UpdateCriterioDto,
  BulkUpdateCriterioDto,
} from "./dto/update-criterio.dto";
import {
  CriterioRepository,
  BulkCreateResult,
  BulkUpdateResult,
} from "./criterio.repository";

@Injectable()
export class CriterioService {
  constructor(private readonly criterioRepository: CriterioRepository) {}

  async create(createCriterioDto: CreateCriterioDto) {
    try {
      return await this.criterioRepository.create(createCriterioDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw new BadRequestException(
              `Critério com o nome "${createCriterioDto.name}" já existe nesta trilha.`
            );
          case "P2003":
            throw new BadRequestException(
              "Trilha ou Ciclo especificado não existe. Verifique os IDs fornecidos."
            );
          default:
            throw new BadRequestException(
              "Erro ao criar critério. Verifique os dados fornecidos."
            );
        }
      }
      throw error;
    }
  }

  async createBulk(
    bulkCreateCriterioDto: BulkCreateCriterioDto
  ): Promise<BulkCreateResult> {
    const { criterios } = bulkCreateCriterioDto;

    if (!criterios || criterios.length === 0) {
      throw new BadRequestException(
        "Nenhum critério fornecido para criação em lote."
      );
    }

    try {
      return await this.criterioRepository.createBulk(bulkCreateCriterioDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002": {
            const failedCriterio = criterios.find((criterio) =>
              error.message.includes(criterio.name)
            );
            const criterioName = failedCriterio?.name || "um dos critérios";
            throw new BadRequestException(
              `Erro na criação em lote: Critério "${criterioName}" já existe nesta trilha. ` +
                "Verifique se não há nomes duplicados na lista ou no banco de dados."
            );
          }
          case "P2003":
            throw new BadRequestException(
              "Erro na criação em lote: Trilha ou Ciclo especificado não existe. " +
                "Verifique os IDs fornecidos."
            );
          default:
            throw new BadRequestException(
              "Erro na criação em lote de critérios. Verifique os dados fornecidos."
            );
        }
      }
      throw error;
    }
  }

  async updateBulk(
    bulkUpdateCriterioDto: BulkUpdateCriterioDto
  ): Promise<BulkUpdateResult> {
    const { criterios } = bulkUpdateCriterioDto;

    if (!criterios || criterios.length === 0) {
      throw new BadRequestException(
        "Nenhum critério fornecido para atualização em lote."
      );
    }

    try {
      return await this.criterioRepository.updateBulk(bulkUpdateCriterioDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002": {
            const failedCriterio = criterios.find((criterio) =>
              error.message.includes(criterio.name || "")
            );
            const criterioName = failedCriterio?.name || "um dos critérios";
            throw new BadRequestException(
              `Erro na atualização em lote: Critério "${criterioName}" já existe nesta trilha. ` +
                "Verifique se não há nomes duplicados na lista ou no banco de dados."
            );
          }
          case "P2003":
            throw new BadRequestException(
              "Erro na atualização em lote: Trilha ou Ciclo especificado não existe. " +
                "Verifique os IDs fornecidos."
            );
          default:
            throw new BadRequestException(
              "Erro na atualização em lote de critérios. Verifique os dados fornecidos."
            );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.criterioRepository.findAll();
  }

  async findAllWithTrilha() {
    return await this.criterioRepository.findAllWithTrilha();
  }

  async findAllWithCiclo() {
    return await this.criterioRepository.findAllWithCiclo();
  }

  async findAllComplete() {
    return await this.criterioRepository.findAllComplete();
  }

  async findByTrilhaId(trilhaId: number) {
    return await this.criterioRepository.findByTrilhaId(trilhaId);
  }

  async findByCicloId(idCiclo: number) {
    return await this.criterioRepository.findByCicloId(idCiclo);
  }

  async findByTrilhaAndCiclo(trilhaId: number, idCiclo: number) {
    return await this.criterioRepository.findByTrilhaAndCiclo(
      trilhaId,
      idCiclo
    );
  }

  async findEnabled() {
    return await this.criterioRepository.findEnabled();
  }

  async findOne(id: number) {
    const criterio = await this.criterioRepository.findById(id);
    if (!criterio) {
      throw new NotFoundException(`Critério com ID ${id} não encontrado.`);
    }
    return criterio;
  }

  async findOneWithTrilha(id: number) {
    const criterio = await this.criterioRepository.findByIdWithTrilha(id);
    if (!criterio) {
      throw new NotFoundException(`Critério com ID ${id} não encontrado.`);
    }
    return criterio;
  }

  async findOneWithCiclo(id: number) {
    const criterio = await this.criterioRepository.findByIdWithCiclo(id);
    if (!criterio) {
      throw new NotFoundException(`Critério com ID ${id} não encontrado.`);
    }
    return criterio;
  }

  async findOneComplete(id: number) {
    const criterio = await this.criterioRepository.findByIdComplete(id);
    if (!criterio) {
      throw new NotFoundException(`Critério com ID ${id} não encontrado.`);
    }
    return criterio;
  }

  async update(id: number, updateCriterioDto: UpdateCriterioDto) {
    // Check if criterio exists
    const existingCriterio = await this.criterioRepository.findById(id);
    if (!existingCriterio) {
      throw new NotFoundException(`Critério com ID ${id} não encontrado.`);
    }

    try {
      return await this.criterioRepository.update(id, updateCriterioDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002":
            throw new BadRequestException(
              `Critério com o nome "${updateCriterioDto.name}" já existe nesta trilha.`
            );
          case "P2003":
            throw new BadRequestException(
              "Trilha ou Ciclo especificado não existe. Verifique os IDs fornecidos."
            );
          default:
            throw new BadRequestException(
              "Erro ao atualizar critério. Verifique os dados fornecidos."
            );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Check if criterio exists
    const existingCriterio = await this.criterioRepository.findById(id);
    if (!existingCriterio) {
      throw new NotFoundException(`Critério com ID ${id} não encontrado.`);
    }

    try {
      return await this.criterioRepository.delete(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2003":
            throw new BadRequestException(
              "Não é possível remover este critério pois existem avaliações vinculadas a ele. " +
                "Remova as avaliações primeiro ou desabilite o critério."
            );
          default:
            throw new BadRequestException(
              "Erro ao remover critério. Verifique se não há dependências vinculadas."
            );
        }
      }
      throw error;
    }
  }

  async count() {
    return await this.criterioRepository.count();
  }

  async countByTrilha(trilhaId: number) {
    return await this.criterioRepository.countByTrilha(trilhaId);
  }

  async countByCiclo(idCiclo: number) {
    return await this.criterioRepository.countByCiclo(idCiclo);
  }
}
