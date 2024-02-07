import Board, { ITask } from "../models/board.models";
import { Response } from "express";
import Utils from "../utils";
import { AuthenticatedRequest } from "../types";

interface IParams {
  boardId?: number;
  taskId?: number;
}

export default class TaskController {
  create = async (req: AuthenticatedRequest<IParams, ITask>, res: Response) => {
    try {
      const userId = req.auth?.userId;
      const boardId = req.params?.boardId;

      if (!userId) {
        return res.status(401).json({
          content: null,
          message: "User not found, please login.",
        });
      }

      const board = await Board.findOne({
        user_id: userId,
        _id: boardId,
      });

      if (!board) {
        return res.status(404).json({
          content: null,
          message: "Board not found.",
        });
      }

      board.tasks.push(req.body);

      await board.save();

      return res.status(201).json({
        content: req.body,
        message: "A new task was created",
      });
    } catch (err) {
      Utils.handleCatchRequest(req, res, err);
    }
  };

  list = async (req: AuthenticatedRequest<IParams, ITask>, res: Response) => {
    try {
      const user_id = req.auth?.userId;
      const boardId = req.params?.boardId;

      const doc = await Board.findOne(
        {
          user_id,
          _id: boardId,
        },
        {
          tasks: 1,
          _id: 0,
        }
      );

      if (!user_id || !boardId) {
        return res.status(400).json({
          content: null,
          message: "Bad request, or user unauthorized",
        });
      }

      if (!doc) {
        return res.status(404).json({
          content: null,
          message: "No tasks were found.",
        });
      }

      return res.status(201).json({
        content: doc.tasks,
        message: `This was the tasks found.`,
      });
    } catch (err) {
      Utils.handleCatchRequest(req, res, err);
    }
  };

  update = async (req: AuthenticatedRequest<IParams, ITask>, res: Response) => {
    try {
      const user_id = req.auth?.userId;
      const taskId = req.params?.taskId;

      const updatedTask = await Board.findOneAndUpdate(
        {
          user_id,
          "tasks._id": taskId,
        },
        {
          $set: {
            "tasks.$": {
              ...req.body,
              _id: taskId,
            },
          },
        },
        {
          new: true,
          projection: { _id: 0, tasks: { $elemMatch: { _id: taskId } } },
        }
      );

      if (!updatedTask) {
        return res.status(201).json({
          content: null,
          message: "It was not possible to update the task selected",
        });
      }

      await updatedTask.validate();

      const {
        tasks: [task],
      } = updatedTask;

      return res.status(201).json({
        content: task,
        message: `Task ${taskId} was updated!`,
      });
    } catch (err) {
      Utils.handleCatchRequest(req, res, err);
    }
  };

  delete = async (req: AuthenticatedRequest<IParams, ITask>, res: Response) => {
    try {
      const user_id = req.auth?.userId;
      const taskId = req.params?.taskId;
      const removedTask = await Board.findOneAndUpdate(
        {
          user_id,
          "tasks._id": taskId,
        },
        { $pull: { tasks: { _id: taskId } } },
        { projection: { _id: 0, tasks: { $elemMatch: { _id: taskId } } } }
      );

      if (!removedTask) {
        return res.status(201).json({
          content: null,
          message: `Was not possible to remove task with id: ${taskId}`,
        });
      }

      const {
        tasks: [task],
      } = removedTask;

      return res.status(201).json({
        content: task,
        message: `The task ${taskId}, was removed`,
      });
    } catch (error) {
      Utils.handleCatchRequest(req, res, error);
    }
  };

}
