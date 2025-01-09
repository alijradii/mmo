"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = __importDefault(require("@colyseus/tools"));
const monitor_1 = require("@colyseus/monitor");
const playground_1 = require("@colyseus/playground");
const gameRoom_1 = require("./rooms/gameRoom");
const auth_1 = require("@colyseus/auth");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const setupAuth_1 = require("./auth/setupAuth");
dotenv_1.default.config();
exports.default = (0, tools_1.default)({
    options: {},
    initializeGameServer: (gameServer) => {
        gameServer.define("overworld", gameRoom_1.GameRoom);
    },
    initializeExpress: (app) => {
        app.use((0, cors_1.default)());
        app.use(body_parser_1.default.json());
        (0, setupAuth_1.setupAuth)();
        app.use(auth_1.auth.prefix, auth_1.auth.routes());
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground_1.playground);
        }
        app.use("/colyseus", (0, monitor_1.monitor)());
    },
    beforeListen: () => {
    },
});
