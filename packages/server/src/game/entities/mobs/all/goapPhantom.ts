import { IWeapon } from "../../../../database/models/weapon.model";
import { GameRoom } from "../../../../rooms/gameRoom";
import { RangedAttack } from "../../../modules/attackModule/rangedAttack";
import { GoapMob } from "../goapMob";
import { entity } from "@colyseus/schema";
import { Rectangle } from "../../../../utils/hitboxes";

const wispWeapon: IWeapon = {
  _id: "wisp_attack",
  name: "wisp attack",
  attackForce: 0,
  attackSpeed: 20,
  damage: 20,
  damageType: "fire",
  description: "",
  group: "axe",
  projectile: "magic_bullet",
  projectileRange: 50,
  projectileSpeed: 300,
  traits: [],
  damageBonuses: [],
  requiredLevel: 0,
  ranged: true,
};

@entity
export class LanternPhantom extends GoapMob {
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

    this.HP = 400;
    this.finalStats.HP = 400;
    this.finalStats.DEX = 12;
    this.finalStats.STR = 12;
    this.finalStats.CON = 12;

    this.maxSpeed = 180;
    this.autoAttack = new RangedAttack(this, wispWeapon);
    this.colliderHeight = 32;
    this.colliderWidth = 28;
    this.forceGrounded = true;

    this.width = 0;
    this.height = 16;
    this.z = 0;

    this.entityType = "lanternphantom";
    this.appearance.set("sprite", "lanternphantom");
  }

  update() {
    this.goapAgent.update();
    this.updatePhysics();
  }
}
