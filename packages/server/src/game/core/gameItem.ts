import { dataStore } from "../../data/dataStore";
import { InventoryItem } from "../items/inventoryItem";
import { GameObject } from "./gameObject";
import { entity } from "@colyseus/schema";
import { RigidBody } from "./rigidBody";
import { GameRoom } from "../../rooms/gameRoom";
import { rectanglesCollider } from "../../utils/hitboxes";

@entity
export class GameItem extends RigidBody {
  item: InventoryItem;

  constructor(gameRoom: GameRoom, item: InventoryItem) {
    super(gameRoom);

    this.sprite = item.id;
    this.item = item;
    this.friction = 0.2;

    this.width = 16;
    this.height = 16;
  }

  update() {
    this.updatePhysics();

    if (
      this.yVelocity === 0 &&
      this.xVelocity === 0 &&
      this.world.state.tick % 20 === 0
    ) {
      this.checkPickUp();
    }
  }

  checkPickUp() {
    for (let [id, player] of this.world.state.players) {
      if (!id) continue;

      if (
        rectanglesCollider(this.getColliderRect(), player.getColliderRect()) &&
        player.state !== "dead"
      ) {
        if (player.pickUpItem(this.item)) {
          this.kill();
          return;
        }
      }
    }
  }

  kill() {
    this.world.state.gameObjects.delete(this.id);
  }
}
