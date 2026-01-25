import { entity } from "@colyseus/schema";
import { IWeapon } from "../../../../database/models/weapon.model";
import { GameRoom } from "../../../../rooms/gameRoom";
import { RangedAttack } from "../../../modules/attackModule/rangedAttack";
import { GunBarrageFeat } from "../../../modules/feats/classes/artificer/gunBarrage";
import { FanOfKnivesFeat } from "../../../modules/feats/classes/assassin/fanOfKnives";
import { ShadowStepFeat } from "../../../modules/feats/classes/assassin/shadowstep";
import { FireBallFeat } from "../../../modules/feats/classes/wizard/fireBall";
import { HomingMissilesFeat } from "../../../modules/feats/classes/wizard/homingMissiles";
import { LightningStormFeat } from "../../../modules/feats/classes/wizard/lightningStorm";
import { DashFeat } from "../../../modules/feats/generic/dash";
import { BatSwarm } from "../../../modules/feats/mobs/lanternphantom/batSwarm";
import { SkeletonArise } from "../../../modules/feats/mobs/lanternphantom/skeleton_arise";
import { Planner } from "../../modules/planning/planner";
import { Mob } from "../mob";
import { MobIdleState } from "../states/mobIdleState";

const wispWeapon: IWeapon = {
  _id: "wisp_attack",
  name: "wisp attack",
  attackForce: 0,
  attackSpeed: 20,
  damage: 10,
  damageType: "fire",
  description: "",
  group: "wand",
  projectile: "magic_bullet",
  projectileRange: 40,
  projectileSpeed: 600,
  traits: [],
  damageBonuses: [],
  requiredLevel: 0,
  ranged: true,
};

@entity
export class LanternPhantom extends Mob {
  constructor(world: GameRoom) {
    super(world);

    this.baseStats.STR = 20;
    this.baseStats.DEX = 20;
    this.baseStats.INT = 20;
    this.baseStats.CON = 20;
    this.baseStats.WIS = 20;
    this.baseStats.CHA = 20;

    this.HP = 15000;
    this.maxSpeed = 150;
    this.autoAttack = new RangedAttack(this, wispWeapon);
    this.colliderHeight = 32;
    this.colliderWidth = 28;
    this.forceGrounded = true;

    this.width = 0;
    this.height = 16;
    this.z = 0;

    this.entityType = "BOSS";
    this.appearance.set("sprite", "lanternphantom");

    this.planner = new Planner(this);

    this.idleState = new MobIdleState(this);
    this.setState(this.idleState);

    this.planner.detectRange = 500;
    this.finalStats.SPEED = 300;

    // summoning feats
    this.feats.push(new BatSwarm(this));
    this.feats.push(new SkeletonArise(this));

    // offensive feats
    this.feats.push(new FireBallFeat(this));
    this.feats.push(new LightningStormFeat(this));
    this.feats.push(new GunBarrageFeat(this));
    this.feats.push(new FanOfKnivesFeat(this));
    this.feats.push(new HomingMissilesFeat(this));

    // movement feats
    this.feats.push(new DashFeat(this));
    this.feats.push(new ShadowStepFeat(this));
  }

  kill() {
    super.kill();
    this.world.eventData.bossKilled = true;
  }
}
