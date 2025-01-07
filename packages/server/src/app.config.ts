import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import express from "express";
import { GameRoom } from "./game/GameRoom";
import cors from "cors"
import bodyParser from "body-parser";
import dotenv from "dotenv"

import statusRouter from "./routes/statusRoute";
import authRouter from "./routes/authRoute";

dotenv.config()

export default config({
  options: {
  },
  initializeGameServer: (gameServer) => {
    gameServer.define("overworld", GameRoom);
  },

  initializeExpress: (app: express.Express) => {
    app.use(cors())
    app.use(bodyParser.json())

    app.use("/api/", statusRouter);
    app.use("/api/", authRouter);

    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground);
    }
    app.use("/colyseus", monitor());
  },

  beforeListen: () => {
  },
});
