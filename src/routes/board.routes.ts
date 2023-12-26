import { Router } from "express";
import BoardController from "../controllers/board.controller";
import TaskController from "../controllers/task.controller";
import SubtaskController from "../controllers/subtask.controller";
import authMiddleware from "../middlewares/auth";

class BoardRoute {
  router = Router();
  boardController = new BoardController();
  taskController = new TaskController();
  subtaskController = new SubtaskController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    //board routes
    this.router.get(
      "/list",
      authMiddleware.authenticateToken,
      this.boardController.list
    );

    this.router.post(
      "/create",
      authMiddleware.authenticateToken,
      this.boardController.create
    );

    this.router.put(
      "/update/:boardId",
      authMiddleware.authenticateToken,
      this.boardController.update
    );

    this.router.delete(
      "/:boardId/delete",
      authMiddleware.authenticateToken,
      this.boardController.delete
    );

    //task routes
    this.router.post(
      "/:boardId/task/create",
      authMiddleware.authenticateToken,
      this.taskController.create
    );

    this.router.get(
      "/:boardId/task/list",
      authMiddleware.authenticateToken,
      this.taskController.list
    );

    this.router.put(
      "/task/:taskId/update",
      authMiddleware.authenticateToken,
      this.taskController.update
    );

    this.router.delete(
      "/task/:taskId/delete",
      authMiddleware.authenticateToken,
      this.taskController.delete
    );

    //subtask routes
    this.router.post(
      "/task/:taskId/subtask/create",
      authMiddleware.authenticateToken,
      this.subtaskController.create
    );

    this.router.get(
      "/task/:taskId/subtask/list",
      authMiddleware.authenticateToken,
      this.subtaskController.list
    );

    this.router.put(
      "/task/subtask/:subtaskId/update",
      authMiddleware.authenticateToken,
      this.subtaskController.update
    );

    this.router.delete(
      "/task/subtask/:subtaskId/delete",
      authMiddleware.authenticateToken,
      this.subtaskController.delete
    );
  }
}

export default new BoardRoute().router;
