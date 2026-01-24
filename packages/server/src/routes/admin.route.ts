import express from "express"
import { addOrUpdateItem, deleteItem, getAllItems } from "../controllers/items.controller"
import { addOrUpdateWeapon, deleteWeapon } from "../controllers/weapons.controller"
import { addOrUpdateArmor, deleteArmor } from "../controllers/armor.controller"
import { getAllPlayers, getPlayerById, updatePlayer, deletePlayer } from "../controllers/players.controller"
import { addOrUpdateClass, deleteClass, getAllClasses } from "../controllers/class.controller"

const adminRouter = express.Router()

adminRouter.get("/items", getAllItems)

adminRouter.post("/item", addOrUpdateItem)
adminRouter.post("/item/delete", deleteItem)

adminRouter.post("/weapon", addOrUpdateWeapon)
adminRouter.post("/weapon/delete", deleteWeapon)

adminRouter.post("/armor", addOrUpdateArmor)
adminRouter.post("/armor/delete", deleteArmor)

adminRouter.get("/classes", getAllClasses)
adminRouter.post("/class", addOrUpdateClass)
adminRouter.post("/class/delete", deleteClass)

adminRouter.get("/players", getAllPlayers)
adminRouter.get("/player/:id", getPlayerById)
adminRouter.post("/player", updatePlayer)
adminRouter.post("/player/delete", deletePlayer)

export default adminRouter