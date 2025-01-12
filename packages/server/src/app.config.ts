import express from "express";

import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { GameRoom } from "./rooms/gameRoom";
import { auth } from "@colyseus/auth";
import { matchMaker } from "colyseus";

import path from "path";
import { fileURLToPath } from "url";

import cors from "cors";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import { setupAuth } from "./auth/setupAuth";

dotenv.config();

export default config({
  options: {},
  initializeGameServer: async (gameServer) => {
    gameServer.define("overworld", GameRoom);

    matchMaker.controller.exposedMethods = ["join", "joinById", "reconnect"];

    await matchMaker.createRoom("overworld", {});
  },

  initializeExpress: (app: express.Express) => {
    app.use(cors({ origin: "*" }));
    app.use(bodyParser.json());

    setupAuth();
    app.use(auth.prefix, auth.routes());

    if (process.env.NODE_ENV !== "production") {
      app.use("/playground", playground);
    }
    app.use("/colyseus", monitor());
  },

  beforeListen: () => {},
});
