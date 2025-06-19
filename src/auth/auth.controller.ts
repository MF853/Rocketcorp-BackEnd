import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
// import { AuthGuard } from "./auth.guard";
import { AuthGuard } from "@nestjs/passport"; // Using Passport's AuthGuard for JWT

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @UseGuards(AuthGuard("jwt")) // Using Passport's JWT AuthGuard
  @Get("me")
  getMe() {
    return this.authService.getMe();
  }
}
