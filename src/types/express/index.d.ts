import { Request } from "express";

export interface UserPayload {
  userId: string;
  email: string;
  roles: string[];
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
