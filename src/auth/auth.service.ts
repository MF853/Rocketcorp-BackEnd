import { Injectable } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  login(authDto: AuthDto) {
    return {
      message: "User logged in successfully",
      user: authDto,
    };
  }
}
