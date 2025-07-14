import { PartialType } from "@nestjs/swagger";
import { CreateCicleDto } from "./create-cicle.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsOptional, IsDateString } from "class-validator";

export class UpdateCicleDto extends PartialType(CreateCicleDto) {
  @ApiProperty({ required: true, description: "Nome do ciclo" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: true, description: "Ano do ciclo" })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiProperty({ required: true, description: "Periodo do ciclo" })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiProperty({
    required: true,
    description: "Status do ciclo",
    enum: ["aberto", "fechado"],
  })
  @IsOptional()
  @IsString()
  @IsEnum(["aberto", "fechado"])
  status?: string;

  @ApiProperty({
    required: false,
    description: "Data de abertura da avaliação",
    type: String,
    format: "date-time",
  })
  @IsOptional()
  @IsDateString()
  dataAberturaAvaliacao?: string;

  @ApiProperty({
    required: false,
    description: "Data de fechamento da avaliação",
    type: String,
    format: "date-time",
  })
  @IsOptional()
  @IsDateString()
  dataFechamentoAvaliacao?: string;

  @ApiProperty({
    required: false,
    description: "Data de abertura da revisão do gestor",
    type: String,
    format: "date-time",
  })
  @IsOptional()
  @IsDateString()
  dataAberturaRevisaoGestor?: string;

  @ApiProperty({
    required: false,
    description: "Data de fechamento da revisão do gestor",
    type: String,
    format: "date-time",
  })
  @IsOptional()
  @IsDateString()
  dataFechamentoRevisaoGestor?: string;

  @ApiProperty({
    required: false,
    description: "Data de abertura da revisão do comitê",
    type: String,
    format: "date-time",
  })
  @IsOptional()
  @IsDateString()
  dataAberturaRevisaoComite?: string;

  @ApiProperty({
    required: false,
    description: "Data de fechamento da revisão do comitê",
    type: String,
    format: "date-time",
  })
  @IsOptional()
  @IsDateString()
  dataFechamentoRevisaoComite?: string;

  @ApiProperty({
    required: false,
    description: "Data de finalização",
    type: String,
    format: "date-time",
  })
  @IsOptional()
  @IsDateString()
  dataFinalizacao?: string;
}
