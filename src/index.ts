import express, { Application } from "express";
import Routes from "./routes";
import mongoose from "mongoose";
import cors from 'cors';

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    mongoose.connect(process.env.DB_HOST as string).catch((err) => {
      console.log(
        "Something went wrong trying to connect to the db server:",
        err
      );
    });
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}
