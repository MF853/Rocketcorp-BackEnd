import { PartialType } from "@nestjs/swagger";
import { CreateCicleDto } from "./create-cicle.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

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
}
