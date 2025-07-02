import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CicleService } from './cicle.service';
import { CreateCicleDto } from './dto/create-cicle.dto';
import { UpdateCicleDto } from './dto/update-cicle.dto';

@Controller('cicle')
export class CicleController {
  constructor(private readonly cicleService: CicleService) {}

  @Post()
  create(@Body() createCicleDto: CreateCicleDto) {
    return this.cicleService.create(createCicleDto);
  }

  @Get()
  findAll() {
    return this.cicleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cicleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCicleDto: UpdateCicleDto) {
    return this.cicleService.update(+id, updateCicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cicleService.remove(+id);
  }
}
