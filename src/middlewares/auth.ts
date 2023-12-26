import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IAuth } from "../types";

interface AuthenticatedRequest extends Request {
  auth?: IAuth;
}

class AuthMiddleware {
  public authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null) return res.sendStatus(403);

    jwt.verify(
      token as string,
      process.env.TOKEN as string,
      (err: jwt.VerifyErrors | null, auth?: any) => {
        console.log(err);
        if (err) return res.sendStatus(403);

        req.auth = auth;

        next();
      }
    );
  }
}

export default new AuthMiddleware();
