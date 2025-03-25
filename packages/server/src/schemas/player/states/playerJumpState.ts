import { State } from "../../entities/genericStates/state";
import { updatePlayerInput } from "../inputController";
import { Player } from "../player";

export class PlayerJumpState extends State {
  declare entity: Player;

  constructor(entity: Player) {
    super("jump", entity);
    this.entity = entity;
  }

  onEnter(): void {
    this.entity.zVelocity = 140;
  }

  update(): void {
    if (this.entity.inputQueue.length === 0) {
      this.entity.updatePhysics();
    } else {
      this.entity.inputQueue.length = 1;
      updatePlayerInput(this.entity, this.world);
    }

    let tileX = Math.floor(this.entity.x / 16);
    let tileY = Math.floor((this.entity.y + 8) / 16);

    const tileHeight = this.world.mapInfo.heightmap[tileY][tileX];

    if (this.entity.z <= 0 && tileHeight > 0) {
      this.entity.setState(this.entity.idleState);
    }
  }
}
