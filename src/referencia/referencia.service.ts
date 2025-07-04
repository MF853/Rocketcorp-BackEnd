import { Injectable, ConflictException } from "@nestjs/common";
import {
  CreateReferenciaDto,
  BulkCreateReferenciaDto,
} from "./dto/create-referencia.dto";
import { UpdateReferenciaDto } from "./dto/update-referencia.dto";
import { Prisma } from "@prisma/client";
import {
  ReferenciaRepository,
  ReferenciaWithBothUsers,
  ReferenciaWithReferenciador,
  ReferenciaWithReferenciado,
  BulkCreateResult,
} from "./referencia.repository";

@Injectable()
export class ReferenciaService {
  constructor(private readonly referenciaRepository: ReferenciaRepository) {}

  async create(
    createReferenciaDto: CreateReferenciaDto
  ): Promise<ReferenciaWithBothUsers> {
    try {
      // Check if referencia already exists
      const exists = await this.referenciaRepository.referenciaExists(
        createReferenciaDto.idReferenciador,
        createReferenciaDto.idReferenciado,
        createReferenciaDto.idCiclo
      );

      if (exists) {
        throw new ConflictException(
          `Referência já existe: O usuário ${createReferenciaDto.idReferenciador} já fez uma referência para o usuário ${createReferenciaDto.idReferenciado} no ciclo ${createReferenciaDto.idCiclo}`
        );
      }

      return await this.referenciaRepository.createReferencia(
        createReferenciaDto
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Extract field information from meta if available
          const fields = (error.meta?.target as string[]) || [];
          if (
            fields.includes("idReferenciador") &&
            fields.includes("idReferenciado") &&
            fields.includes("idCiclo")
          ) {
            throw new ConflictException(
              `Referência duplicada: O usuário ${createReferenciaDto.idReferenciador} já fez uma referência para o usuário ${createReferenciaDto.idReferenciado} no ciclo ${createReferenciaDto.idCiclo}`
            );
          }
          throw new ConflictException(
            `Violação de restrição única: Não é possível criar esta referência pois ela já existe`
          );
        }
        if (error.code === "P2003") {
          throw new Error(
            `Erro de chave estrangeira: Verifique se os IDs do referenciador, referenciado e ciclo existem no sistema`
          );
        }
        throw new Error(`Falha ao criar referência: ${error.message}`);
      }
      throw new Error(`Falha ao criar referência: ${(error as Error).message}`);
    }
  }

  async createBulk(
    bulkCreateReferenciaDto: BulkCreateReferenciaDto
  ): Promise<BulkCreateResult> {
    try {
      const { referencias } = bulkCreateReferenciaDto;

      if (!referencias || referencias.length === 0) {
        throw new Error("Nenhuma referência fornecida para criação em lote");
      }

      // Check for duplicates within the batch
      const seen = new Set<string>();
      const duplicatesInBatch: Array<{
        index: number;
        idReferenciador: number;
        idReferenciado: number;
        idCiclo: number;
      }> = [];

      for (let i = 0; i < referencias.length; i++) {
        const ref = referencias[i];
        const key = `${ref.idReferenciador}-${ref.idReferenciado}-${ref.idCiclo}`;

        if (seen.has(key)) {
          duplicatesInBatch.push({
            index: i + 1,
            idReferenciador: ref.idReferenciador,
            idReferenciado: ref.idReferenciado,
            idCiclo: ref.idCiclo,
          });
        }
        seen.add(key);
      }

      if (duplicatesInBatch.length > 0) {
        const duplicateDetails = duplicatesInBatch
          .map(
            (dup) =>
              `Posição ${dup.index}: usuário ${dup.idReferenciador} → usuário ${dup.idReferenciado} (ciclo ${dup.idCiclo})`
          )
          .join("; ");

        throw new ConflictException(
          `Referências duplicadas no lote: ${duplicateDetails}`
        );
      }

      // Check for existing referencias in database
      const existingChecks = await Promise.all(
        referencias.map(async (ref, index) => {
          const exists = await this.referenciaRepository.referenciaExists(
            ref.idReferenciador,
            ref.idReferenciado,
            ref.idCiclo
          );
          return exists ? { index: index + 1, ref } : null;
        })
      );

      const existingRefs = existingChecks.filter(
        (item): item is NonNullable<typeof item> => item !== null
      );

      if (existingRefs.length > 0) {
        const existingDetails = existingRefs
          .map(
            (existing) =>
              `Posição ${existing.index}: usuário ${existing.ref.idReferenciador} → usuário ${existing.ref.idReferenciado} (ciclo ${existing.ref.idCiclo})`
          )
          .join("; ");

        throw new ConflictException(
          `Referências já existem no sistema: ${existingDetails}`
        );
      }

      return await this.referenciaRepository.createBulkReferencias(
        bulkCreateReferenciaDto
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Extract more detailed information from the error
          const fields = (error.meta?.target as string[]) || [];
          if (
            fields.includes("idReferenciador") &&
            fields.includes("idReferenciado") &&
            fields.includes("idCiclo")
          ) {
            throw new ConflictException(
              `Erro de referência duplicada: Uma ou mais referências no lote já existem no sistema. Verifique se não há combinações repetidas de referenciador, referenciado e ciclo.`
            );
          }
          throw new ConflictException(
            `Violação de restrição única: Algumas referências no lote não puderam ser criadas pois já existem`
          );
        }
        if (error.code === "P2003") {
          throw new Error(
            `Erro de chave estrangeira: Verifique se todos os IDs de usuários e ciclos existem no sistema`
          );
        }
        throw new Error(`Falha ao criar referências em lote: ${error.message}`);
      }
      throw new Error(
        `Falha ao criar referências em lote: ${(error as Error).message}`
      );
    }
  }

  async findAll(): Promise<ReferenciaWithBothUsers[]> {
    return await this.referenciaRepository.findAllReferencias();
  }

  async findOne(id: number): Promise<ReferenciaWithBothUsers> {
    const referencia = await this.referenciaRepository.findReferenciaById(id);

    if (!referencia) {
      throw new Error(`Referência com ID ${id} não foi encontrada`);
    }

    return referencia;
  }

  async findByReferenciador(
    idReferenciador: number
  ): Promise<ReferenciaWithReferenciado[]> {
    return await this.referenciaRepository.findReferenciasByReferenciador(
      idReferenciador
    );
  }

  async findByReferenciado(
    idReferenciado: number
  ): Promise<ReferenciaWithReferenciador[]> {
    return await this.referenciaRepository.findReferenciasByReferenciado(
      idReferenciado
    );
  }

  async findByCiclo(idCiclo: number): Promise<ReferenciaWithBothUsers[]> {
    return await this.referenciaRepository.findReferenciasByCiclo(idCiclo);
  }

  async update(
    id: number,
    updateReferenciaDto: UpdateReferenciaDto
  ): Promise<ReferenciaWithBothUsers> {
    try {
      return await this.referenciaRepository.updateReferencia(
        id,
        updateReferenciaDto
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error(
            `Referência com ID ${id} não foi encontrada para atualização`
          );
        }
        throw new Error(`Falha ao atualizar referência: ${error.message}`);
      }
      throw new Error(
        `Falha ao atualizar referência: ${(error as Error).message}`
      );
    }
  }

  async remove(id: number): Promise<{ id: number }> {
    try {
      return await this.referenciaRepository.deleteReferencia(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error(
            `Referência com ID ${id} não foi encontrada para exclusão`
          );
        }
        throw new Error(`Falha ao excluir referência: ${error.message}`);
      }
      throw new Error(
        `Falha ao excluir referência: ${(error as Error).message}`
      );
    }
  }
}
