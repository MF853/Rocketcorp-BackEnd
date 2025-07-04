import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./interfaces/jwtpayload.interface";
import { UserPayload } from "src/types/express";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: authDto.email },
    });
    if (!user) {
      throw new ForbiddenException("Invalid credentials");
    }
    const isPasswordValid = await argon2.verify(
      user.password,
      authDto.password
    );
    if (!isPasswordValid) {
      throw new ForbiddenException("Invalid credentials");
    }
    const userPayload: UserPayload = {
      userId: user.id,
      email: authDto.email,
      roles: ["user"], // para exemplo
    };
    const payload: JwtPayload = { user: userPayload };

    // Generate access token (1 hour)
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("JWT_SECRET"),
      expiresIn: "1h",
    });

    // Generate refresh token (7 days)
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("JWT_SECRET"),
      expiresIn: "7d",
    });

    return {
      message: "Login successful",
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.config.get<string>("JWT_SECRET"),
        }
      );

      const userPayload: UserPayload = decoded.user;
      const payload: JwtPayload = { user: userPayload };

      const newAccessToken = await this.jwtService.signAsync(payload, {
        secret: this.config.get<string>("JWT_SECRET"),
        expiresIn: "1h",
      });

      return {
        message: "Token refreshed successfully",
        access_token: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  getMe() {
    return {
      message: "User details retrieved successfully",
    };
  }
}
