import { IWeapon } from "../../../../database/models/weapon.model";
import { GameRoom } from "../../../../rooms/gameRoom";
import { RangedAttack } from "../../../modules/attackModule/rangedAttack";
import { Planner } from "../../modules/planning/planner";
import { Mob } from "../mob";
import { entity } from "@colyseus/schema";
import { MobIdleState } from "../states/mobIdleState";
import { GoapAgent } from "../../../goap/core/goapAgent";

const wispWeapon: IWeapon = {
  _id: "wisp_attack",
  name: "wisp attack",
  attackForce: 0,
  attackSpeed: 120,
  damage: 20 * 0,
  damageType: "fire",
  description: "",
  group: "wand",
  projectile: "magic_bullet",
  projectileRange: 50,
  projectileSpeed: 300,
  traits: [],
  damageBonuses: [],
  requiredLevel: 0,
  ranged: true,
};

@entity
export class LanternPhantom extends Mob {
    goapAgent: GoapAgent;
  constructor(world: GameRoom) {
    super(world);

    this.HP = 400;
    this.maxSpeed = 150;
    this.autoAttack = new RangedAttack(this, wispWeapon);
    this.colliderHeight = 32;
    this.colliderWidth = 28;
    this.forceGrounded = true;

    this.width = 0;
    this.height = 16;
    this.z = 0;

    this.entityType = "lanternphantom";
    this.appearance.set("sprite", "lanternphantom");

    this.planner = new Planner(this);

    this.idleState = new MobIdleState(this);
    this.setState(this.idleState);

    this.goapAgent = new GoapAgent(this);
  }

  update() {
    this.goapAgent.update();
    this.updatePhysics();
  }
}
