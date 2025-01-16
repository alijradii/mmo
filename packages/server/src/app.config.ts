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
    matchMaker.controller.getCorsHeaders = function (req) {
      return {
        "Access-Control-Allow-Origin":process.env.FRONT_END_URL,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        Vary: "Origin",
      };
    };
    matchMaker.controller.exposedMethods = ["join", "joinById", "reconnect"];
    // matchMaker.controller.DEFAULT_CORS_HEADERS["Access-Control-Allow-Origin"] =
    // "*";

    await matchMaker.createRoom("overworld", {});
  },

  initializeExpress: (app: express.Express) => {
    app.use(
      cors({
        origin: process.env.FRONT_END_URL, // Allow only this origin
        credentials: true, // Allow credentials (cookies, authorization headers)
      })
    );

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
