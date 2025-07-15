import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipeDto {
  @ApiProperty({ example: 'Squad Rocket', description: 'Nome da equipe' })
  nome: string;

  @ApiProperty({ example: 'Equipe responsável pelo produto Rocket', required: false })
  descricao?: string;

  @ApiProperty({ example: 2, description: 'ID do gestor (user com role manager)' })
  idGestor: number;

  @ApiProperty({ example: [3,4,5], description: 'IDs dos membros (users com role user)', required: false })
  membros?: number[];
} 