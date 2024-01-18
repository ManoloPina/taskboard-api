import { ObjectId } from "mongoose";
import { Request } from "express";
import { TypeResult } from "./http";

export interface IAuth {
  userId: string;
  iat: string;
  expiration: string;
}

export interface AuthenticatedRequest<P, R> extends Request<P, {}, R> {
  auth?: IAuth;
}

export interface IRes<T> {
  content: T;
  message: string;
  typeResult: TypeResult;
}
