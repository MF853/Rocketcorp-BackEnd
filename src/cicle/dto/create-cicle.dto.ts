import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsDateString } from "class-validator";

export class CreateCicleDto {
    @ApiProperty({ required: true, description: "Nome do ciclo" })
    @IsString()
    name: string;
  
    @ApiProperty({ required: true, description: "Ano do ciclo" })
    @IsString()
    year: string;

    @ApiProperty({ required: true, description: "Periodo do ciclo" })
    @IsString()
    period: string;
  
    @ApiProperty({ required: true, description: "Status do ciclo", enum: ["aberto", "fechado"] })
    @IsString()
    @IsEnum(["aberto", "fechado"])
    status: string;

    @ApiProperty({ required: true, description: "Data de abertura da avaliação", type: String, format: 'date-time' })
    @IsDateString()
    dataAberturaAvaliacao: string;
  
    @ApiProperty({ required: true, description: "Data de fechamento da avaliação", type: String, format: 'date-time' })
    @IsDateString()
    dataFechamentoAvaliacao: string;
  
    @ApiProperty({ required: true, description: "Data de abertura da revisão do gestor", type: String, format: 'date-time' })
    @IsDateString()
    dataAberturaRevisaoGestor: string;
  
    @ApiProperty({ required: true, description: "Data de fechamento da revisão do gestor", type: String, format: 'date-time' })
    @IsDateString()
    dataFechamentoRevisaoGestor: string;
  
    @ApiProperty({ required: true, description: "Data de abertura da revisão do comitê", type: String, format: 'date-time' })
    @IsDateString()
    dataAberturaRevisaoComite: string;
  
    @ApiProperty({ required: true, description: "Data de fechamento da revisão do comitê", type: String, format: 'date-time' })
    @IsDateString()
    dataFechamentoRevisaoComite: string;
  
    @ApiProperty({ required: true, description: "Data de finalização", type: String, format: 'date-time' })
    @IsDateString()
    dataFinalizacao: string;
}