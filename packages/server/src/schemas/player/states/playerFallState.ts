import { State } from "../../entities/genericStates/state";
import { Player } from "../player";

export class PlayerFallState extends State {
  declare entity: Player;

  constructor(entity: Player) {
    super("jump", entity);
    this.entity = entity;
  }

  update(): void {
    this.entity.inputQueue.length = 0;
    this.entity.updatePhysics();

    let tileX = Math.floor(this.entity.x / 16);
    let tileY = Math.floor((this.entity.y + 8) / 16);

    const tileHeight = this.world.mapInfo.heightmap[tileY][tileX];

    if (this.entity.z <= 0 && tileHeight > 0) {
      this.entity.setState(this.entity.idleState);
    }
  }
}
