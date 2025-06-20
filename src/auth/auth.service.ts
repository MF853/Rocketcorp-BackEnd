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
@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    // eslint-disable-next-line prettier/prettier
    private jwtService: JwtService
  ) {}

  async login(authDto: AuthDto) {
    const testPassword = "password123";
    const testHashedPassword = await argon2.hash(testPassword);
    const validPassword = await argon2.verify(
      testHashedPassword,
      // eslint-disable-next-line prettier/prettier
      authDto.password
    );
    if (!validPassword || authDto.email !== "admin@email.com") {
      throw new ForbiddenException("Invalid credentials");
    }
    const userPayload: UserPayload = {
      userId: "1",
      email: authDto.email,
      roles: ["user"],
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
          // eslint-disable-next-line prettier/prettier
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
