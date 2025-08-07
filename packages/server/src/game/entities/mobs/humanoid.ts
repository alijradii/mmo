import { HumanoidAppearance } from "../../../data/mobs/humanoids";
import { IPlayer } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { StatBlock } from "../../modules/abilityScores/abilityScores";
import { Player } from "../../player/player";
import { entity } from "@colyseus/schema";
import { Planner } from "../modules/planning/planner";
import { MobIdleState } from "./states/mobIdleState";

@entity
export class Humanoid extends Player {
  constructor(
    world: GameRoom,
    _appearace: HumanoidAppearance,
    weapon: string,
    statBlock: StatBlock,
    iclass: string
  ) {
    const appearance: IPlayer["appearance"] = {
      head: _appearace.head || "",
      hair: _appearace.hair || "",
      frontextra: _appearace.frontextra || "",
      backextra: _appearace.backextra || "",
      backhair: _appearace.backhair || "",
      top: _appearace.top || "",
      bottom: _appearace.bottom || "",
      hat: _appearace.hat || "",
      weapon: "",
    };

    const post: IPlayer = {
      _id: "dummy",
      appearance,
      x: 0,
      y: 0,
      class: iclass,
      STR: statBlock.STR,
      DEX: statBlock.DEX,
      INT: statBlock.INT,
      CHA: statBlock.CHA,
      WIS: statBlock.WIS,
      CON: statBlock.CON,
      coins: 0,
      inventoryGrid: [],
      level: 0,
      race: "misc",
      party: -1,
      primaryAttribute: "STR",
      points: 0,
      gear: {
        boots: null,
        chest: null,
        helmet: null,
        legs: null,
        offhand: null,
        weapon: { itemId: weapon, quantity: 1 },
      },
      username: "",
      xp: 0,
    };

    super(world, post);

    this.entityType = "NPC";
    this.forceGrounded = true;

    this.planner = new Planner(this);

    this.idleState = new MobIdleState(this);
    this.setState(this.idleState);

    if (statBlock.HP) this.finalStats.HP = statBlock.HP;
    this.HP = this.finalStats.HP;
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

  kill() {
    this.world.state.entities.delete(this.id);
  }
}
