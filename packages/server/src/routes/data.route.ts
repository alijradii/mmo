import express from "express"
import { getAllClasses } from "../controllers/data.controller"
import { getAllItems } from "../controllers/items.controller"
import { getAllWeapons } from "../controllers/weapons.controller"

const dataRouter = express.Router()

dataRouter.get("/classes", getAllClasses)
dataRouter.get("/items", getAllItems)
dataRouter.get("/weapons", getAllWeapons)

export default dataRouter