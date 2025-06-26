import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsArray,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTrilhaDto {
  @ApiProperty({
    description: "Nome da trilha de desenvolvimento ou carreira",
    example: "Desenvolvimento Full Stack",
    type: String,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}

export class BulkCreateTrilhaDto {
  @ApiProperty({
    description: "Array de trilhas para criação em lote",
    type: [CreateTrilhaDto],
    example: [
      {
        name: "Desenvolvimento Full Stack",
      },
      {
        name: "Data Science & Analytics",
      },
      {
        name: "DevOps & Cloud",
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTrilhaDto)
  @IsOptional()
  trilhas?: CreateTrilhaDto[];
}
