import { User } from "@prisma/client";

export class Avaliacao {
  id: number;
  idAvaliador: number;
  idAvaliado: number;
  idCiclo: number;
  nota?: number;
  justificativa: string;
  criterioId: number;
  createdAt: Date;
  updatedAt: Date;

  avaliador?: User;
  avaliado?: User;
  criterio?: {
    id: number;
    name: string;
    enabled: boolean;
    trilhaId: number;
  };
}

export class Avaliacao360 {
  id: number;
  idAvaliador: number;
  idAvaliado: number;
  idCiclo: number;
  nota?: number;
  pontosFortes: string;
  pontosMelhora: string;
  createdAt: Date;
  updatedAt: Date;

  avaliador?: User;
  avaliado?: User;
}
