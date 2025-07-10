import { User as PrismaUser, Autoavaliacao, Avaliacao360, referencia } from "@prisma/client";

export class User implements PrismaUser {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
  unidade: string | null;
  createdAt: Date;
  updatedAt: Date;
  mentorId: number | null;
  avaliadorId: number | null;
  trilhaId: number | null;

  // Relacionamentos
  mentor?: User;
  mentorados?: User[];
  trilha?: {
    id: number;
    name: string;
  };
  avaliacoesFeitas?: Autoavaliacao[];
  avaliacoesRecebidas?: Autoavaliacao[];
  avaliacoes360Feitas?: Avaliacao360[];
  avaliacoes360Recebidas?: Avaliacao360[];
  referenciasFeitas?: referencia[];
  referenciasRecebidas?: referencia[];
} 