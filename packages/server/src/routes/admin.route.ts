import express from "express"
import { addOrUpdateItem, getAllItems } from "../controllers/admin.controller"

const adminRouter = express.Router()

adminRouter.get("items", getAllItems)

adminRouter.post("item", addOrUpdateItem)
adminRouter.delete("item")

export default adminRouter