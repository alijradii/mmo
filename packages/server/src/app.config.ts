import express from "express";

import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { GameRoom } from "./rooms/gameRoom";
import { auth } from "@colyseus/auth";
import { matchMaker } from "colyseus";

import cors from "cors";

import dotenv from "dotenv";
import { setupAuth } from "./auth/setupAuth";
import userRouter from "./routes/user.route";
import connectDB from "./database/db";
import usersRouter from "./routes/users.route";

import { dataStore } from "./data/dataStore";
import adminRouter from "./routes/admin.route";
import { adminMiddleware } from "./middleware/admin.middleware";
import dataRouter from "./routes/data.route";
import { MAPS_DATA } from "./data/maps/mapData";
import ticketRouter from "./routes/ticket.route";

dotenv.config();

export default config({
  options: {},
  initializeGameServer: async (gameServer) => {
    matchMaker.controller.getCorsHeaders = function (req) {
      const FRONT_END_URL = process.env.FRONT_END_URL;

      if (!FRONT_END_URL) throw new Error();

      return {
        "Access-Control-Allow-Origin": FRONT_END_URL,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        Vary: "Origin",
      };
    };

    matchMaker.controller.exposedMethods = ["join", "joinById", "reconnect"];
    // matchMaker.controller.DEFAULT_CORS_HEADERS["Access-Control-Allow-Origin"] =
    // "*";

    await dataStore.init();

    for (const mapName in MAPS_DATA) {
      gameServer.define(mapName, GameRoom);
      await matchMaker.createRoom(mapName, {});
    }
  },

  initializeExpress: async (app: express.Express) => {
    console.log("front end: ", process.env.FRONT_END_URL);
    app.get("/", (request, response) => {
      response.json({ status: "online" });
    });

    app.use(
      cors({
        origin: process.env.FRONT_END_URL, // Allow only this origin
        credentials: true, // Allow credentials (cookies, authorization headers)
      })
    );

    // middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    setupAuth();
    app.use(auth.prefix, auth.routes());

    // static
    app.use(express.static("public"));

    // db set up
    connectDB();

    // api routes
    app.use("/reservation", auth.middleware(), ticketRouter);
    app.use("/user", auth.middleware(), userRouter);
    app.use("/users", auth.middleware(), usersRouter);
    app.use("/admin", auth.middleware(), adminMiddleware, adminRouter);
    app.use("/api", dataRouter);

    if (process.env.NODE_ENV !== "production") {
      app.use("/playground", playground);
    }
    app.use("/colyseus", monitor());
  },

  beforeListen: () => {},
});
