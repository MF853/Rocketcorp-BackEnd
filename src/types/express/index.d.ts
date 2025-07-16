import { Request } from "express";
import { Role } from "@prisma/client";

export interface UserPayload {
  userId: int;
  email: string;
  roles: Role[];
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
