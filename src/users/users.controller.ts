import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,

} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Lista todos os usuários" })
  @ApiResponse({
    status: 200,
    description: "Lista de usuários retornada com sucesso.",
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Busca um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário retornado com sucesso." })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Get("email/:email")
  @ApiOperation({ summary: "Busca um usuário pelo email" })
  @ApiResponse({ status: 200, description: "Usuário retornado com sucesso." })
  findByEmail(@Param("email") email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get(":id/mentorados")
  @ApiOperation({ summary: "Lista todos os mentorados de um mentor" })
  @ApiResponse({
    status: 200,
    description: "Lista de mentorados retornada com sucesso.",
  })
  findMentorados(@Param("id") id: string) {
    return this.usersService.findMentorados(+id);
  }

  @Get("trilha/:trilhaId")
  @ApiOperation({ summary: "Lista todos os usuários de uma trilha" })
  @ApiResponse({
    status: 200,
    description: "Lista de usuários da trilha retornada com sucesso.",
  })
  findByTrilha(@Param("trilhaId") trilhaId: string) {
    return this.usersService.findByTrilha(+trilhaId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário atualizado com sucesso." })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove um usuário pelo ID" })
  @ApiResponse({ status: 200, description: "Usuário removido com sucesso." })
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
} 