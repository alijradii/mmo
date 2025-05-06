import express from "express"
import { getAllClasses } from "../controllers/data.controller"
import { getAllItems } from "../controllers/admin.controller"

const dataRouter = express.Router()

dataRouter.get("/classes", getAllClasses)
dataRouter.get("/items", getAllItems)

export default dataRouter