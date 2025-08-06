import { IWeapon } from "../../../../database/models/weapon.model";
import { GameRoom } from "../../../../rooms/gameRoom";
import { Planner } from "../../modules/planning/planner";
import { Mob } from "../mob";
import { entity } from "@colyseus/schema";
import { MobIdleState } from "../states/mobIdleState";
import { GoapAgent } from "../../../goap/core/goapAgent";
import { Rectangle } from "../../../../utils/hitboxes";
import { MeleeAttack } from "../../../modules/attackModule/meleeAttack";
import { MobGoapAgent } from "../../../goap/agents/mobGaopAgent";

const slimeAttack: IWeapon = {
  _id: "slime_attack",
  name: "Slime Attack",
  attackForce: 100,
  attackSpeed: 20,
  damage: 6,
  damageType: "bludgeoning",
  description: "",
  group: "misc",
  traits: [],
  damageBonuses: [],
  requiredLevel: 0,
};

@entity
export class Slime extends Mob {
  goapAgent: GoapAgent;

  getHitBoxRect(): Rectangle {
    return {
      x: this.x - this.colliderWidth / 2,
      y: this.y - this.colliderHeight / 2,
      width: this.colliderWidth,
      height: this.colliderHeight,
    };
  }
  constructor(world: GameRoom) {
    super(world);

    this.finalStats.HP = 100;
    this.finalStats.DEX = 10;
    this.finalStats.STR = 20;

    this.HP = 100;
    this.maxSpeed = 100;
    this.autoAttack = new MeleeAttack(this, slimeAttack);
    this.colliderHeight = 32;
    this.colliderWidth = 32;
    this.forceGrounded = true;

    this.width = 0;
    this.height = 16;
    this.z = 0;

    this.entityType = "slime";
    this.appearance.set("sprite", "slime");

    this.planner = new Planner(this);

    this.idleState = new MobIdleState(this);
    this.setState(this.idleState);

    this.goapAgent = new MobGoapAgent(this);
  }

  update() {
    this.goapAgent.update();
    this.updatePhysics();
  }
}
