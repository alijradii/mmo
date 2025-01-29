import express from "express"
import { getUser } from "../controllers/user.controller" 

const usersRouter = express.Router()

usersRouter.get("/:id", getUser)

export default usersRouter