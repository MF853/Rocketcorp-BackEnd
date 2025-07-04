import {
  IsNumber,
  IsString,
  IsPositive,
  IsArray,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReferenciaDto {
  @ApiProperty({
    description: "ID do usuário que está fazendo a referência",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idReferenciador: number;

  @ApiProperty({
    description: "ID do usuário que está recebendo a referência",
    example: 2,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idReferenciado: number;

  @ApiProperty({
    description:
      "Justificativa detalhada da referência, explicando os motivos e qualidades do referenciado",
    example:
      "Profissional excepcional com forte capacidade de liderança e trabalho em equipe. Sempre entrega resultados de alta qualidade e demonstra grande comprometimento com os objetivos da empresa.",
    type: String,
  })
  @IsString()
  justificativa: string;

  @ApiProperty({
    description: "ID do ciclo de avaliação ao qual esta referência pertence",
    example: 1,
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  idCiclo: number;
}

export class BulkCreateReferenciaDto {
  @ApiProperty({
    description: "Array de referências para criação em lote",
    type: [CreateReferenciaDto],
    example: [
      {
        idReferenciador: 1,
        idReferenciado: 2,
        idCiclo: 1,
        justificativa:
          "Excelente profissional com forte capacidade de liderança.",
      },
      {
        idReferenciador: 2,
        idReferenciado: 3,
        idCiclo: 1,
        justificativa:
          "Desenvolvedor muito talentoso com conhecimento técnico excepcional.",
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReferenciaDto)
  @IsOptional()
  referencias?: CreateReferenciaDto[];
}
