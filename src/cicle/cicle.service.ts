import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CicleRepository } from "./cicle.repository";
import { CreateCicleDto } from "./dto/create-cicle.dto";
import { UpdateCicleDto } from "./dto/update-cicle.dto";
import { UsersService } from "../users/users.service";
import { Ciclo } from "@prisma/client";

@Injectable()
export class CicleService {
  constructor(
    private readonly cicleRepository: CicleRepository,
    private readonly usersService: UsersService
  ) {}
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
    const hoje = new Date();
    const ciclo = await this.cicleRepository.findCicloAtualByData(hoje);

    if (!ciclo) {
      throw new NotFoundException(
        "Nenhum ciclo em andamento encontrado para a data atual."
      );
    }

    // O ciclo já vem com statusAtual do repository
    return ciclo;
  }

  async getLastFinalizado() {
    return this.cicleRepository.findLastFinalizado();
  }

  async findOrCreateByString(cicloString: string) {
    const [yearStr, periodStr] = cicloString.split(".");
    const year = Number(yearStr);
    const period = Number(periodStr);

    try {
      return await this.cicleRepository.findByYearAndPeriod(year, period);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return this.cicleRepository.create({
          name: cicloString,
          year: year.toString(),
          period: period.toString(),
          status: "aberto",
          dataAberturaAvaliacao: "2025-07-11T10:30:45-03:00",
          dataFechamentoAvaliacao: "2025-07-11T10:30:45-03:00",
          dataAberturaRevisaoGestor: "2025-07-11T10:30:45-03:00",
          dataFechamentoRevisaoGestor: "2025-07-11T10:30:45-03:00",
          dataAberturaRevisaoComite: "2025-07-11T10:30:45-03:00",
          dataFechamentoRevisaoComite: "2025-07-11T10:30:45-03:00",
          dataFinalizacao: "2025-07-11T10:30:45-03:00",
        });
      }

      throw error;
    }
  }

  async update(id: number, updateCicleDto: UpdateCicleDto) {
    await this.findOne(id);

    // Validação de sobreposição de datas
    const {
      dataAberturaAvaliacao,
      dataFechamentoAvaliacao,
      dataAberturaRevisaoGestor,
      dataFechamentoRevisaoGestor,
      dataAberturaRevisaoComite,
      dataFechamentoRevisaoComite,
      dataFinalizacao,
    } = updateCicleDto;

    // Busca o ciclo atual para preencher valores não atualizados
    const cicloAtual = await this.cicleRepository.findById(id);
    const periodos = [
      {
        ini: new Date(
          dataAberturaAvaliacao ?? cicloAtual.dataAberturaAvaliacao
        ),
        fim: new Date(
          dataFechamentoAvaliacao ?? cicloAtual.dataFechamentoAvaliacao
        ),
        nome: "avaliação",
      },
      {
        ini: new Date(
          dataAberturaRevisaoGestor ?? cicloAtual.dataAberturaRevisaoGestor
        ),
        fim: new Date(
          dataFechamentoRevisaoGestor ?? cicloAtual.dataFechamentoRevisaoGestor
        ),
        nome: "revisao_gestor",
      },
      {
        ini: new Date(
          dataAberturaRevisaoComite ?? cicloAtual.dataAberturaRevisaoComite
        ),
        fim: new Date(
          dataFechamentoRevisaoComite ?? cicloAtual.dataFechamentoRevisaoComite
        ),
        nome: "revisao_comite",
      },
      {
        ini: new Date(dataFinalizacao ?? cicloAtual.dataFinalizacao),
        fim: new Date(dataFinalizacao ?? cicloAtual.dataFinalizacao),
        nome: "finalizado",
      },
    ];
    // Validação de datas: fechamento não pode ser antes da abertura
    for (const periodo of periodos) {
      if (periodo.fim < periodo.ini) {
        throw new BadRequestException(
          `Erro: a data de fechamento do período '${
            periodo.nome
          }' (${periodo.fim.toISOString()}) não pode ser anterior à data de abertura (${periodo.ini.toISOString()})`
        );
      }
    }
    for (let i = 0; i < periodos.length - 1; i++) {
      const atual = periodos[i];
      const prox = periodos[i + 1];
      if (atual.fim > prox.ini) {
        throw new BadRequestException(
          `Erro: ocorreu uma sobreposição de datas entre períodos do ciclo. O período '${
            atual.nome
          }' termina em ${atual.fim.toISOString()} e o próximo período '${
            prox.nome
          }' começa em ${prox.ini.toISOString()}`
        );
      }
    }

    await this.cicleRepository.update(id, updateCicleDto);
    return "Ciclo atualizado com sucesso";
  }

  async getUsersByCiclo(id: number) {
    // Retorna apenas os usuários que fizeram autoavaliação no ciclo
    return this.usersService.findUsersWithAutoavaliacaoByCiclo(id);
  }

  async getCycleInRevisaoComite(): Promise<Ciclo> {
    const currentDate = new Date();
    const cycle = await this.cicleRepository.findCycleInRevisaoComite(
      currentDate
    );

    if (!cycle) {
      throw new NotFoundException(
        "No cycle found in 'revisao comite' phase for the current date"
      );
    }

    return cycle;
  }
}
