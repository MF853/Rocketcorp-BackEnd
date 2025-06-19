import { UserPayload } from "src/types/express";

export interface JwtPayload {
  user: UserPayload;
}
