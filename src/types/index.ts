import { ObjectId } from "mongoose";
import { Request } from "express";

export interface IAuth {
  userId: string;
  iat: string;
  expiration: string;
}

export interface AuthenticatedRequest<P, R> extends Request<P, {}, R> {
  auth?: IAuth;
}
