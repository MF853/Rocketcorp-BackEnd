import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { RequestWithUser } from "src/types/express";
import { JwtGuard, RolesGuard } from "./guard";
import { Roles } from "./decorators/roles.decorator";
import { Role } from "src/enums/roles.enum";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @UseGuards(JwtGuard)
  @Get("me")
  getMe(@Req() req: RequestWithUser) {
    const user = req.user;
    console.log("User from request:", user);
    return this.authService.getMe();
  }

  @Roles(Role.Admin)
  @UseGuards(JwtGuard, RolesGuard)
  @Get("admin")
  getAdmin(@Req() req: RequestWithUser) {
    const user = req.user;
    console.log("Admin User from request:", user);
    return {
      message: "Admin access granted",
      user,
    };
  }
}
