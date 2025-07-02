import { Injectable, NotFoundException } from '@nestjs/common';
import { CicleRepository } from "./cicle.repository";
import { CreateCicleDto } from './dto/create-cicle.dto';
import { UpdateCicleDto } from './dto/update-cicle.dto';

@Injectable()
export class CicleService {
  constructor(private readonly cicleRepository: CicleRepository) {}
  create(createCicleDto: CreateCicleDto) {
    return 'This action adds a new cicle';
  }
  
  findAll() {
    return this.cicleRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} cicle`;
  }

  update(id: number, updateCicleDto: UpdateCicleDto) {
    return `This action updates a #${id} cicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} cicle`;
  }
}
