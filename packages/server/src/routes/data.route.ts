import express from "express"
import { getAllClasses } from "../controllers/data.controller"

const dataRouter = express.Router()

dataRouter.get("/classes", getAllClasses)

export default dataRouter