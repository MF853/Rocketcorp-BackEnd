import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, IsEnum } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ required: false, description: "Nome do usuário" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, description: "Senha do usuário" })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false, description: "Papel do usuário no sistema", enum: ["user", "admin"] })
  @IsString()
  @IsEnum(["user", "admin"])
  @IsOptional()
  role?: string[];

  @ApiProperty({ required: false, description: "Unidade do usuário" })
  @IsString()
  @IsOptional()
  unidade?: string;

  @ApiProperty({ required: false, description: "ID do mentor do usuário" })
  @IsNumber()
  @IsOptional()
  mentorId?: number;

  @ApiProperty({ required: false, description: "ID da trilha do usuário" })
  @IsNumber()
  @IsOptional()
  trilhaId?: number;
} 