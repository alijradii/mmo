import { HumanoidAppearance } from "../../../data/mobs/humanoids";
import { IPlayer } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { MobGoapAgent } from "../../goap/agents/mobGaopAgent";
import { GoapAgent } from "../../goap/core/goapAgent";
import { StatBlock } from "../../modules/abilityScores/abilityScores";
import { Player } from "../../player/player";
import { entity } from "@colyseus/schema";

@entity
export class Humanoid extends Player {
  goapAgent: GoapAgent;
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

    this.goapAgent = new MobGoapAgent(this);

    if (statBlock.HP) this.finalStats.HP = statBlock.HP;
  }

  updatePhysics(): void {
    super.updatePhysics();

    if (this.accelDir.x !== 0 || this.accelDir.y !== 0) {
      this.direction = getDirectionFromVector({
        x: this.accelDir.x,
        y: this.accelDir.y,
      });
    }

    if (this.z > 0) {
      this.state = "jump";
    }

    if (this.z <= 0 && this.state === "jump") {
      this.state = "idle";
      this.accelDir.x = 0;
      this.accelDir.y = 0;
      this.xVelocity = 0;
      this.yVelocity = 0;
    }
  }

  jump(): void {
    this.zVelocity = 140;
    this.goapAgent.worldState["state"] = "jump";
  }

  stun(duration: number) {
    this.goapAgent.worldState["stunned"] = duration;
  }

  update() {
    this.goapAgent.update();
    this.updatePhysics();

    for (const feat of this.feats) feat.update();

    for (let statusEffect of this.statusEffects) {
      statusEffect.update();
    }
  }

  kill() {
    super.kill();
    this.setState(this.idleState);
  }
}
