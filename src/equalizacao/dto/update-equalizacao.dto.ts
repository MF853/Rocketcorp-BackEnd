import {
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  IsNotEmpty,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateEqualizacaoDto {
  @ApiProperty({
    description: "ID da equalização a ser atualizada",
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: "Nova nota final da equalização",
    example: 4.5,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  notaFinal?: number;

  @ApiProperty({
    description: "Nova justificativa da equalização",
    example:
      "Colaborador demonstrou excelente desempenho técnico e trabalho em equipe.",
    required: false,
  })
  @IsString()
  @IsOptional()
  justificativa?: string;
}
