import { dataStore } from "../../data/dataStore";
import { InventoryItem } from "../items/inventoryItem";
import { GameObject } from "./gameObject";
import {entity} from "@colyseus/schema"

@entity
export class GameItem extends GameObject {
    item: InventoryItem;

    constructor(item: InventoryItem) {
        super();

        this.sprite = item.id;
        this.item = item;
    }
}