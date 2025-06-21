import express from "express"
import { resetCharacter, updateMe } from "../controllers/user.controller" 

const userRouter = express.Router()

// userRouter.post("/gear", editUserGear)
userRouter.post("/me", updateMe)
userRouter.delete("/me", resetCharacter)

export default userRouter