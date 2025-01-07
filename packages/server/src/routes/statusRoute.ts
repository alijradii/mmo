import express from "express"
import { getStatus } from "../controllers/statusController" 

const statusRouter = express.Router()

statusRouter.get("/status", getStatus)

export default statusRouter