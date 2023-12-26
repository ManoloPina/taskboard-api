import { Request, Response } from "express";
import Board, { IBoard } from "../models/board.models";
import { IAuth } from "../types";
import Utils from "../utils";

interface AuthenticatedRequest<P, R> extends Request<P, {}, R> {
  auth?: IAuth;
}

class BoardController {
  create = async (req: AuthenticatedRequest<{}, IBoard>, res: Response) => {
    try {
      if (!req.auth?.userId) {
        return res.status(403).json({
          content: null,
          message: "Invalid credentials",
        });
      }

      if (!req.body) {
        return res.status(400).json({
          content: null,
          message: "Bad Request. Content is missing.",
        });
      }

      const { name } = req.body;

      const newBoard = await Board.create({
        name,
        user_id: req.auth.userId,
      });

      if (!newBoard) {
        return res.status(201).json({
          content: null,
          message: "It was possible to register a new board",
        });
      } else {
        return res.status(201).json({
          content: newBoard.toObject({ getters: true, versionKey: false }),
          message: "A new board was created",
        });
      }
    } catch (err: any) {
      Utils.handleCatchRequest(req, res, err);
    }
  };

  list = async (req: AuthenticatedRequest<{}, IBoard>, res: Response) => {
    try {
      const user_id = req.auth?.userId;

      if (!user_id) {
        return res.status(400).json({
          content: null,
          message: "Bad request, the user was not found.",
        });
      }

      const boards = await Board.find({ user_id: req.auth?.userId });

      if (boards.length === 0) {
        return res.status(200).json({
          content: boards,
          message: "Any board was created yet.",
        });
      }

      return res.json({
        content: boards,
        message: `${boards.length} board(s) was found.`,
      });
    } catch (err: any) {
      Utils.handleCatchRequest(req, res, err);
    }
  };

  update = async (
    req: AuthenticatedRequest<{ boardId: string }, IBoard>,
    res: Response
  ) => {
    try {
      const user_id = req.auth?.userId;
      const boardId = req.params.boardId;

      const updatedBoard = await Board.findOneAndUpdate(
        { user_id, _id: boardId },
        req.body,
        {
          new: true,
        }
      );

      if (!updatedBoard) {
        return res.status(201).json({
          content: null,
          message: "Board not found",
        });
      }

      return res.status(201).json({
        content: updatedBoard,
        message: `The board:${boardId} was updated`,
      });
    } catch (err: any) {
      Utils.handleCatchRequest(req, res, err);
    }
  };

  delete = async (
    req: AuthenticatedRequest<{ boardId?: number }, IBoard>,
    res: Response
  ) => {
    try {
      const boardId = req.params?.boardId;
      const deletedBoard = await Board.findOneAndDelete({ _id: boardId });
      if (!deletedBoard) {
        return res.status(201).json({
          content: null,
          message: "Was not possible to remove this board.",
        });
      }

      return res.status(201).json({
        content: deletedBoard,
        message: `The board: ${boardId} was deleted`,
      });
    } catch (err: any) {
      Utils.handleCatchRequest(req as any, res, err);
    }
  };
}

export default BoardController;
