import express from "express"
import { editUserGear, updateMe } from "../controllers/user.controller" 

const userRouter = express.Router()

userRouter.post("/gear", editUserGear)
userRouter.post("/me", updateMe)

export default userRouter