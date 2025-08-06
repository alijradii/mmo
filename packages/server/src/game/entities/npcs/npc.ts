import { IPlayer } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { Player } from "../../player/player";
import { State } from "../genericStates/state";
import { Planner } from "../modules/planning/planner";
import { NPCIdleState } from "./states/npcIdleState";
import { NPCJumpState } from "./states/npcJumpState";
import { entity } from "@colyseus/schema";

@entity
export class NPC extends Player {
  constructor(world: GameRoom, document: IPlayer) {
    super(world, document);

    this.entityType = "NPC";
    this.forceGrounded = true;

    this.planner = new Planner(this);
    this.idleState = new NPCIdleState(this);

    this.setState(this.idleState);
  }

  receiveMessage({
    message,
    senderEntity,
  }: {
    message: string;
    senderEntity: Player;
  }) {
    if (!message || !senderEntity) return;
  }

  sendMessage(message: string) {
    if (!message) return;
  }

  jump(): void {
    this.setState(new NPCJumpState(this, this.getState()));
  }

  updatePhysics(): void {
    super.updatePhysics();

    if (this.accelDir.x !== 0 || this.accelDir.y !== 0) {
      this.direction = getDirectionFromVector({
        x: this.accelDir.x,
        y: this.accelDir.y,
      });
    }
  }

  update() {
    super.update();
  }

  setState(state: State): void {
    super.setState(state);
  }

  kill() {
    super.kill();
    this.setState(this.idleState);
  }
}
