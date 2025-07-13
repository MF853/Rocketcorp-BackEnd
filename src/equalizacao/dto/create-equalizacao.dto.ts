import { IsNumber, IsString, IsNotEmpty, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEqualizacaoDto {
  @ApiProperty({
    description: "ID do ciclo de avaliação",
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idCiclo: number;

  @ApiProperty({
    description: "ID do avaliador",
    example: 18,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idAvaliador: number;

  @ApiProperty({
    description: "ID do usuário avaliado",
    example: 18,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  idAvaliado: number;

  @ApiProperty({
    description: "Nota final da equalização",
    example: 4.5,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  notaFinal: number;

  @ApiProperty({
    description: "Justificativa da equalização",
    example:
      "Colaborador demonstrou excelente desempenho técnico e trabalho em equipe.",
  })
  @IsString()
  @IsNotEmpty()
  justificativa: string;
}
