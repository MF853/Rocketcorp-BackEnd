import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { RequestWithUser } from "src/types/express";
import { JwtGuard, RolesGuard } from "./guard";
import { Roles } from "./decorators/roles.decorator";
import { Role } from "src/enums/roles.enum";
import { Response, Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(
    @Body() authDto: AuthDto,
    // eslint-disable-next-line prettier/prettier
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(authDto);

    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: result.message,
      access_token: result.access_token,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  refresh(@Req() req: Request) {
    const cookies = req.cookies as Record<string, string>;
    const refreshToken = cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }
    return this.authService.refresh(refreshToken);
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
