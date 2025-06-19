import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config"; // Assuming you use ConfigService for JWT_SECRET
import { JwtPayload } from "../interfaces/jwtpayload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") || "122", // Use your secret from ConfigService
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return { email: payload.email }; // Simple example: returns payload directly
  }
}
