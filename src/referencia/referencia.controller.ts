import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ReferenciaService } from "./referencia.service";
import {
  CreateReferenciaDto,
  BulkCreateReferenciaDto,
} from "./dto/create-referencia.dto";
import { UpdateReferenciaDto } from "./dto/update-referencia.dto";

@Controller("referencia")
export class ReferenciaController {
  constructor(private readonly referenciaService: ReferenciaService) {}

  @Post()
  create(@Body() createReferenciaDto: CreateReferenciaDto) {
    return this.referenciaService.create(createReferenciaDto);
  }

  @Post("bulk")
  createBulk(@Body() bulkCreateReferenciaDto: BulkCreateReferenciaDto) {
    return this.referenciaService.createBulk(bulkCreateReferenciaDto);
  }

  @Get()
  findAll() {
    return this.referenciaService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.referenciaService.findOne(+id);
  }

  @Get("referenciador/:id")
  findByReferenciador(@Param("id") id: string) {
    return this.referenciaService.findByReferenciador(+id);
  }

  @Get("referenciado/:id")
  findByReferenciado(@Param("id") id: string) {
    return this.referenciaService.findByReferenciado(+id);
  }

  @Get("ciclo/:id")
  findByCiclo(@Param("id") id: string) {
    return this.referenciaService.findByCiclo(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateReferenciaDto: UpdateReferenciaDto
  ) {
    return this.referenciaService.update(+id, updateReferenciaDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.referenciaService.remove(+id);
  }
}
