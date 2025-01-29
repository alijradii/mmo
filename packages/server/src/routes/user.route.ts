import express from "express"
import { editUserGear } from "../controllers/user.controller" 

const userRouter = express.Router()

userRouter.post("/gear", editUserGear)

export default userRouter