import { Router } from "express";
import AuthController from "../controllers/auth.controller";

class AuthRoute {
  router = Router();
  authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/create", this.authController.create);

    this.router.post("/login", this.authController.login);
  }
}

export default new AuthRoute().router;
