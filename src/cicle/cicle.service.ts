import { Injectable, NotFoundException } from '@nestjs/common';
import { CicleRepository } from "./cicle.repository";
import { CreateCicleDto } from './dto/create-cicle.dto';
import { UpdateCicleDto } from './dto/update-cicle.dto';

@Injectable()
export class CicleService {
  constructor(private readonly cicleRepository: CicleRepository) {}
  async create(createCicleDto: CreateCicleDto) {
    await this.cicleRepository.create(createCicleDto);
    return 'Ciclo criado com sucesso';
  }

  async findAll() {
    return await this.cicleRepository.findAll();
  }

  async findOne(id: number) {
    const cicle = await this.cicleRepository.findById(id);
    if(!cicle){
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return cicle;
  }

  update(id: number, updateCicleDto: UpdateCicleDto) {
    return `This action updates a #${id} cicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} cicle`;
  }
}
