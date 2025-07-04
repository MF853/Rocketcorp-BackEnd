import { Injectable, NotFoundException } from "@nestjs/common";
import { CicleRepository } from "./cicle.repository";
import { CreateCicleDto } from "./dto/create-cicle.dto";
import { UpdateCicleDto } from "./dto/update-cicle.dto";

@Injectable()
export class CicleService {
  constructor(private readonly cicleRepository: CicleRepository) {}
  async create(createCicleDto: CreateCicleDto) {
    await this.cicleRepository.create(createCicleDto);
    return "Ciclo criado com sucesso";
  }

  async findAll() {
    return await this.cicleRepository.findAll();
  }

  async findOne(id: number) {
    const cicle = await this.cicleRepository.findById(id);
    if (!cicle) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return cicle;
  }

  async getByYearAndPeriod(year: number, period: number) {
    const ciclo = await this.cicleRepository.findByYearAndPeriod(year, period);
    if (!ciclo) {
      throw new NotFoundException("Ciclo não encontrado");
    }
    return ciclo;
  }

  async getCicloAtual() {
    const ciclo = await this.cicleRepository.findByStatus("aberto");

    if (!ciclo) {
      throw new NotFoundException(
        "Nenhum ciclo com status 'aberto' encontrado."
      );
    }

    console.log("Ciclo atual encontrado:", ciclo);
    return ciclo;
  }

  async findOrCreateByString(cicloString: string) {
    const [yearStr, periodStr] = cicloString.split(".");
    const year = Number(yearStr);
    const period = Number(periodStr);

    // tenta achar o ciclo
    const existing = await this.cicleRepository.findByYearAndPeriod(
      year,
      period
    );

    if (existing) {
      return existing;
    }

    // se não existir, cria
    return this.cicleRepository.create({
      name: cicloString,
      year,
      period,
      status: "aberto", // ou outro valor padrão
    });
  }

  async update(id: number, updateCicleDto: UpdateCicleDto) {
    await this.findOne(id);
    await this.cicleRepository.update(id, updateCicleDto);
    return "Ciclo atualizado com sucesso";
  }
}
