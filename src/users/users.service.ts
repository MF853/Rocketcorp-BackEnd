import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserStatisticsResponseDto } from "./dto/user-statistics-response.dto";
import { UserPerformanceResponseDto } from "./dto/performance-data.dto";
import { UserEvaluationCyclesResponseDto } from "./dto/evaluation-cycle.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(data: any) {
    return this.usersRepository.create(data);
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    // if (!user) {
    //   throw new NotFoundException(`User with email ${email} not found`);
    // }
    return user;
  }

  async findMentorados(mentorId: number) {
    const mentor = await this.usersRepository.findById(mentorId);
    if (!mentor) {
      throw new NotFoundException(`Mentor with ID ${mentorId} not found`);
    }
    return this.usersRepository.findMentorados(mentorId);
  }

  async findByTrilha(trilhaId: number) {
    return this.usersRepository.findByTrilha(trilhaId);
  }

  async findByEquipe(equipeId: number) {
    return this.usersRepository.findByEquipe(equipeId);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check if user exists
    // Se idEquipe for alterado, atualize gestorId
    if (updateUserDto.idEquipe !== undefined) {
      let novoGestorId: number | null = null;
      if (updateUserDto.idEquipe !== null) {
        // Buscar equipe para pegar o gestor
        const equipe = await this.usersRepository.findEquipeById(
          updateUserDto.idEquipe
        );
        novoGestorId = equipe?.idGestor ?? null;
      }
      return this.usersRepository.update(id, {
        ...updateUserDto,
        gestorId: novoGestorId,
      });
    }
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    await this.findOne(id); // Check if user exists
    return this.usersRepository.delete(id);
  }

  async getUserStatistics(
    userId: number,
    idCiclo?: number
  ): Promise<UserStatisticsResponseDto> {
    const statistics = await this.usersRepository.getUserStatistics(
      userId,
      idCiclo
    );
    if (!statistics) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return statistics;
  }

  async getAllUsersStatisticsByCycle(
    idCiclo: number
  ): Promise<UserStatisticsResponseDto[]> {
    return this.usersRepository.getAllUsersStatisticsByCycle(idCiclo);
  }

  async getMembrosAndGestorByEquipe(equipeId: number) {
    return this.usersRepository.findMembrosAndGestorByEquipe(equipeId);
  }

  async getUserPerformanceData(
    userId: number
  ): Promise<UserPerformanceResponseDto> {
    const user = await this.findOne(userId);
    const performanceData = await this.usersRepository.getUserPerformanceData(
      userId
    );

    return {
      userId: user.id,
      userName: user.name,
      performanceData,
    };
  }

  async getUserEvaluationCycles(
    userId: number
  ): Promise<UserEvaluationCyclesResponseDto> {
    const user = await this.findOne(userId);
    const evaluationCycles = await this.usersRepository.getUserEvaluationCycles(
      userId
    );

    return {
      userId: user.id,
      userName: user.name,
      evaluationCycles,
    };
  }
}
