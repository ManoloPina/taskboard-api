import { Application } from "express";
import authRoute from "./auth.routes";
import boardRoutes from "./board.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/auth", authRoute);
    app.use("/board", boardRoutes);
  }
}
