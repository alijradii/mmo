import express from "express"
import { getAllClasses } from "../controllers/data.controller"
import { getAllItems } from "../controllers/items.controller"
import { getAllWeapons } from "../controllers/weapons.controller"
import { getAllArmor } from "../controllers/armor.controller"

const dataRouter = express.Router()

dataRouter.get("/classes", getAllClasses)
dataRouter.get("/items", getAllItems)
dataRouter.get("/weapons", getAllWeapons)
dataRouter.get("/armor", getAllArmor)

export default dataRouter