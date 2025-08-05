import { dataStore } from "../../data/dataStore";
import { InventoryItem } from "../items/inventoryItem";
import { GameObject } from "./gameObject";
import { entity } from "@colyseus/schema";
import { RigidBody } from "./rigidBody";
import { GameRoom } from "../../rooms/gameRoom";

@entity
export class GameItem extends RigidBody {
  item: InventoryItem;

  constructor(gameRoom: GameRoom, item: InventoryItem) {
    super(gameRoom);

    this.sprite = item.id;
    this.item = item;
    this.friction = 0.2;
  }

  update() {
    this.updatePhysics();
  }
}
