import express from "express"
import { addOrUpdateItem, deleteItem, getAllItems } from "../controllers/items.controller"
import { addOrUpdateWeapon, deleteWeapon } from "../controllers/weapons.controller"

const adminRouter = express.Router()

adminRouter.get("/items", getAllItems)

adminRouter.post("/item", addOrUpdateItem)
adminRouter.post("/item/delete", deleteItem)

adminRouter.post("/weapon", addOrUpdateWeapon)
adminRouter.post("/weapon/delete", deleteWeapon)

export default adminRouter