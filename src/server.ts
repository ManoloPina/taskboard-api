import express, { Application } from "express";
import dotenv from "dotenv";
import Server from ".";

dotenv.config();

const app: Application = express();
const server: Server = new Server(app);

app
  .listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
