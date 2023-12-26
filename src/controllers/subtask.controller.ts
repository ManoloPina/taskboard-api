import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import Board, { ISubtask } from "../models/board.models";
import Utils from "../utils";
import mongoose from "mongoose";

type Params = {
  taskId?: number | string;
  subtaskId?: number | string;
};

export default class SubtaskController {
  create = async (
    req: AuthenticatedRequest<Params, ISubtask>,
    res: Response
  ) => {
    const taskId = req.params?.taskId;
    try {
      const newSubTask = await Board.findOneAndUpdate(
        { "tasks._id": taskId },
        { $push: { "tasks.$.subtasks": req.body } },
        { new: true } // Ensure that the updated document is returned
      );

      if (!newSubTask) {
        return res.status(201).json({
          content: null,
          message: "It was not possible to add a new subtask",
        });
      }

      const pushedSubtask = newSubTask.tasks
        .flatMap((task) => task.subtasks)
        .slice(-1)[0];

      return res.status(201).json({
        content: pushedSubtask,
        message: "New subtask added!",
      });
    } catch (err) {
      Utils.handleCatchRequest(req, res, err);
    }
  };

  list = async (req: AuthenticatedRequest<Params, ISubtask>, res: Response) => {
    const user_id = req.auth?.userId;
    const taskId = req.params?.taskId;

    try {
      const subtasks = await Board.aggregate([
        {
          $match: {
            user_id: new mongoose.Types.ObjectId(user_id),
            "tasks._id": new mongoose.Types.ObjectId(taskId),
          },
        },
        {
          $unwind: "$tasks",
        },
        {
          $match: {
            "tasks._id": new mongoose.Types.ObjectId(taskId),
          },
        },
        {
          $project: {
            _id: 0,
            subtasks: "$tasks.subtasks",
          },
        },
        {
          $unwind: "$subtasks", // Unwind the subtasks array
        },
        {
          $replaceRoot: { newRoot: "$subtasks" }, // Replace the root with subtasks
        },
      ]);

      res.status(201).json({
        content: subtasks,
        message: `${subtasks.length} were found.`,
      });
    } catch (err) {
      Utils.handleCatchRequest(req, res, err);
    }
  };

  update = async (
    req: AuthenticatedRequest<Params, ISubtask>,
    res: Response
  ) => {
    const subtaskId = req.params?.subtaskId;
    try {
      const updatedSubtask = await Board.findOneAndUpdate(
        {
          "tasks.subtasks._id": subtaskId,
        },
        {
          $set: {
            "tasks.$.subtasks": {
              ...req.body,
              _id: subtaskId,
            },
          },
        },
        {
          new: true,
        }
      );
      console.log("🚀 ~ updatedSubtask:", updatedSubtask);

      if (!updatedSubtask) {
        return res.status(201).json({
          content: null,
          message: "Was not possible to update the selected task",
        });
      }

      await updatedSubtask.validate();

      const _updatedTask = updatedSubtask.tasks
        .flatMap((task) => task.subtasks)
        .find((subtask) => subtask._id.toString() === subtaskId);

      return res.status(201).json({
        content: _updatedTask,
        message: `subtask ${subtaskId} was updated`,
      });
    } catch (err) {
      Utils.handleCatchRequest(req, res, err);
    }
  };

  delete = async (
    req: AuthenticatedRequest<Params, ISubtask>,
    res: Response
  ) => {
    try {
      const subtaskId = req.params?.subtaskId;

      const deletedSubtask = await Board.findOneAndUpdate(
        {
          "tasks.subtasks._id": subtaskId,
        },
        {
          $pull: {
            "tasks.$.subtasks": { _id: subtaskId },
          },
        },
        {
          new: true,
        }
      );

      if (!deletedSubtask) {
        return res.status(404).json({
          content: false,
          message: `Subtask ${subtaskId} not found.`,
        });
      }

      return res.status(200).json({
        content: true,
        message: `Subtask ${subtaskId} was removed.`,
      });
    } catch (err) {
      Utils.handleCatchRequest(req, res, err);
    }
  };
}
