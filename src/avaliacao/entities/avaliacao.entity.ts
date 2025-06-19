export class AvaliacaoAbstrata {
  id: number;
  idAvaliador: number;
  idAvaliado: number;
  idCiclo: number;
  nota?: number;
}

export class Avaliacao {
  id: number;
  justificativa: string;
  criterio: string;
  avaliacaoAbstrataId: number;
  avaliacaoAbstrata?: AvaliacaoAbstrata;
}

export class Avaliacao360 {
  id: number;
  pontosFortes: string;
  pontosMelhora: string;
  avaliacaoAbstrataId: number;
  avaliacaoAbstrata?: AvaliacaoAbstrata;
}
