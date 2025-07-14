import { User, MotivacaoTrabalhoNovamente } from "@prisma/client";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Autoavaliacao {
  id: number;
  idAvaliador: number;
  idAvaliado: number;
  idCiclo: number;
  nota?: number;
  justificativa: string;
  criterioId: number;
  notaGestor?: number;
  justificativaGestor?: string;
  createdAt: Date;
  updatedAt: Date;

  avaliador?: User;
  avaliado?: User;
  criterio: {
    id: number;
    name: string;
    enabled: boolean;
    trilhaId: number;
  } | null;
}

@Entity('mentoring')
export class Mentoring {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_mentor' })
  idMentor: number;

  @Column({ name: 'id_mentorado' })
  idMentorado: number;

  @Column({ name: 'id_ciclo' })
  idCiclo: number;

  @Column({ type: 'int' })
  nota: number;

  @Column({ type: 'text' })
  justificativa: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export class Avaliacao360 {
  id: number;
  idAvaliador: number;
  idAvaliado: number;
  idCiclo: number;
  nota?: number;
  pontosFortes: string;
  pontosMelhora: string;
  nomeProjeto: string;
  periodoMeses: number;
  trabalhariaNovamente: MotivacaoTrabalhoNovamente;
  createdAt: Date;
  updatedAt: Date;

  avaliador?: User;
  avaliado?: User;
}
