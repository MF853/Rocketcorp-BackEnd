import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsPositive,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTrilhaItemDto {
  @ApiProperty({
    description: "ID da trilha a ser atualizada",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: "Novo nome da trilha de desenvolvimento ou carreira",
    example: "Desenvolvimento Full Stack Avançado",
    type: String,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;
}

export class BulkUpdateTrilhaDto {
  @ApiProperty({
    description: "Array de trilhas para atualização em lote",
    type: [UpdateTrilhaItemDto],
    example: [
      {
        id: 1,
        name: "Desenvolvimento Full Stack Avançado",
      },
      {
        id: 2,
        name: "Data Science & Machine Learning",
      },
      {
        id: 3,
        name: "DevOps & Cloud Computing",
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTrilhaItemDto)
  @IsOptional()
  trilhas?: UpdateTrilhaItemDto[];
}
