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

  async getUsersByGestor(gestorId: number) {
    // Busca todas as equipes do gestor
    const equipes = await this.equipeRepository.findByGestorId(gestorId);
    // Junta todos os membros das equipes
    const users = equipes.flatMap(equipe => equipe.membros || []);
    // Remove duplicados por id
    const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values());
    // Retorna apenas id, name e email
    return uniqueUsers.map(u => ({ id: u.id, name: u.name, email: u.email }));
  }
} 