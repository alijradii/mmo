import express from "express"
import { authenticate } from "../controllers/authController"

const authRouter = express.Router()

authRouter.get("/auth", authenticate)

export default authRouter