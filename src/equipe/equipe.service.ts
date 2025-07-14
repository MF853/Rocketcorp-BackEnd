import { Injectable } from '@nestjs/common';
import { EquipeRepository } from './equipe.repository';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';

@Injectable()
export class EquipeService {
  constructor(private readonly equipeRepository: EquipeRepository) {}

  create(createEquipeDto: CreateEquipeDto) {
    return this.equipeRepository.create(createEquipeDto);
  }

  findAll() {
    return this.equipeRepository.findAll();
  }

  findOne(id: number) {
    return this.equipeRepository.findOne(id);
  }

  update(id: number, updateEquipeDto: UpdateEquipeDto) {
    return this.equipeRepository.update(id, updateEquipeDto);
  }

  remove(id: number) {
    return this.equipeRepository.remove(id);
  }
} 