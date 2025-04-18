import express from "express";
import { getMe, getUser } from "../controllers/user.controller";

const usersRouter = express.Router();

usersRouter.get("/me", getMe);
usersRouter.get("/:id", getUser);

export default usersRouter;
