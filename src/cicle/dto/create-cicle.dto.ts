import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, IsEnum } from "class-validator";

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
}