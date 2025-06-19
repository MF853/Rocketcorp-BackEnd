import { ForbiddenException, Injectable } from "@nestjs/common";
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
    return {
      message: "Login successful",
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.config.get<string>("JWT_SECRET"),
      }),
    };
  }

  getMe() {
    return {
      message: "User details retrieved successfully",
    };
  }
}
