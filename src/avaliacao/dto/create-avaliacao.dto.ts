export class CreateAvaliacaoAbstrataDto {
  idAvaliador: number;
  idAvaliado: number;
  idCiclo: number;
  nota?: number;
}

export class CreateAvaliacaoDto {
  justificativa: string;
  criterio: string;
  avaliacaoAbstrata: CreateAvaliacaoAbstrataDto;
}

export class CreateAvaliacao360Dto {
  pontosFortes: string;
  pontosMelhora: string;
  avaliacaoAbstrata: CreateAvaliacaoAbstrataDto;
}
