import express from "express"
import { addOrUpdateItem, deleteItem, getAllItems } from "../controllers/admin.controller"

const adminRouter = express.Router()

adminRouter.get("/items", getAllItems)

adminRouter.post("/item", addOrUpdateItem)
adminRouter.post("/item/delete", deleteItem)

export default adminRouter