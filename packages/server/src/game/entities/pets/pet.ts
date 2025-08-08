import { IWeapon } from "../../../database/models/weapon.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { getDirectionFromVector } from "../../../utils/math/vec2";
import { NpcAgent } from "../../goap/agents/npcAgent";
import { GoapAgent } from "../../goap/core/goapAgent";
import { MeleeAttack } from "../../modules/attackModule/meleeAttack";
import { Entity } from "../entity";
import { entity } from "@colyseus/schema";

const petAttack: IWeapon = {
  _id: "pet_attack",
  attackForce: 0,
  attackSpeed: 20,
  damage: 10,
  damageBonuses: [],
  damageType: "bludgeoning",
  description: "",
  group: "misc",
  name: "attack",
  requiredLevel: 0,
  traits: [],
};

@entity
export class Pet extends Entity {
  ownerId: string;
  goapAgent: GoapAgent;

  constructor(world: GameRoom) {
    super(world);

    this.width = 0;
    this.height = 16;
    this.entityType = "PET";
    this.appearance.set("sprite", "pet_fox");
    this.ownerId = "";
    this.party = 3;

    this.autoAttack = new MeleeAttack(this, petAttack);
    this.goapAgent = new NpcAgent(this);
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
}
