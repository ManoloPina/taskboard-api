import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import Utils from "../utils";

interface ILoginRequestProps {
  email: string;
  password: string;
}

export default class AuthController {
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
      Utils.handleCatchRequest(req, res, err);
    }
  };

  login = async (req: Request<{}, {}, ILoginRequestProps>, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          content: null,
          message: "Invalid credentials",
        });
      }

      const isPasswordValid = await bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          content: null,
          message: "Invalid credentials",
        });
      }

      const token = this.generateAccessToken(user._id.toString());

      res.status(200).json({
        content: { ...user.toObject(), token },
        message: "Login successful",
      });
    } catch (err: any) {
      Utils.handleCatchRequest(req, res, err);
    }
  };
}
