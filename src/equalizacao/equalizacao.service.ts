import { Injectable } from "@nestjs/common";
import { CreateEqualizacaoDto } from "./dto/create-equalizacao.dto";
import { UpdateEqualizacaoDto } from "./dto/update-equalizacao.dto";
import { EqualizacaoResponseDto } from "./dto/equalizacao-response.dto";
import { EqualizacaoRepository } from "./equalizacao.repository";

@Injectable()
export class EqualizacaoService {
  constructor(private readonly equalizacaoRepository: EqualizacaoRepository) {}

  create(createEqualizacaoDto: CreateEqualizacaoDto) {
    return "This action adds a new equalizacao";
  }

  findAll() {
    return `This action returns all equalizacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} equalizacao`;
  }

  update(id: number, updateEqualizacaoDto: UpdateEqualizacaoDto) {
    return `This action updates a #${id} equalizacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} equalizacao`;
  }

  async getEqualizacoesByCycle(
    idCiclo: number
  ): Promise<EqualizacaoResponseDto[]> {
    const result = await this.equalizacaoRepository.getEqualizacoesByCycle(
      idCiclo
    );
    return result;
  }
}
