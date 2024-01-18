import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import Utils from "../utils";
import { TypeResult } from "../types/http";
import { IRes } from "../types";
import HttpService from "../services/http";
interface ILoginRequestProps {
  email: string;
  password: string;
}

interface ILoginRes extends IUser {
  token: string;
}

export default class AuthController extends HttpService {
  generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.TOKEN as string, {
      expiresIn: "1d",
    });
  };

  create = async (req: Request<{}, {}, IUser>, res: Response) => {
    try {
      if (!req.body) {
        return res.status(400).json({
          error: "Bad Request. 'content' is missing.",
        });
      } else {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
          });
          if (!!newUser) {
            const token = this.generateAccessToken(newUser._id.toString());
            res.status(201).json({
              content: { ...newUser.toObject(), token },
              message: "New user registered",
            });
          } else {
            res.status(201).json({
              content: null,
              message: "Was not possible to register a new user",
            });
          }
        } else {
          res.status(201).json({
            content: user,
            message: "User already exists",
          });
        }
      }
    } catch (err) {
      this.handleCatchResponse(res, err);
    }
  };

  login = async (
    req: Request<{}, {}, ILoginRequestProps>,
    res: Response<IRes<Partial<ILoginRes> | null>>
  ) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }, { __v: 0 }).lean();

      if (!user) {
        return res.status(201).json({
          content: null,
          message: "Invalid credentials",
          typeResult: TypeResult.Warning,
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          content: null,
          message: "Invalid credentials",
          typeResult: TypeResult.Warning,
        });
      }

      const token = this.generateAccessToken(user._id.toString());

      const { password: _, ..._user } = user;

      return res.status(200).json({
        content: { ..._user, token },
        message: "Login successful",
        typeResult: TypeResult.Success,
      });
    } catch (err: any) {
      this.handleCatchResponse(res, err);
    }
  };
}
