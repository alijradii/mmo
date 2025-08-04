import { dataStore } from "../../data/dataStore";
import { InventoryItem } from "../items/inventoryItem";
import { GameObject } from "./gameObject";
import {type} from "@colyseus/schema"

export class GameItem extends GameObject {
    item: InventoryItem;

    @type("string")
    sprite: string;

    constructor(item: InventoryItem) {
        super();

        this.sprite = dataStore.items.get(item.id)?.sprite || "";
        this.item = item;
    }
}