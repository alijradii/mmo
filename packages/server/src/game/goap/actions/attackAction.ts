import { Entity } from "../../entities/entity";
import { Attack } from "../../modules/attackModule/attack";
import { Action } from "../core/action";

export class AttackAction extends Action {
  public target: Entity;
  public attack: Attack;

  constructor(entity: Entity, target: Entity, attack: Attack) {
    const cost = attack.weapon.attackSpeed;

    const name = attack.weapon.ranged ? "ranged" : "melee";

    const conditions: Record<string, any> = {};
    const effects: Record<string, any> = { state: "attack" };

    effects[`attack_${target.id}`] = true;

    if (attack.weapon.ranged) {
      conditions[`within_range_${target.id}`] = true;
    } else conditions[`within_bounds_${target.id}`] = true;

    super(`attack_${name}_${target.id}`, cost, conditions, effects, entity);

    this.target = target;
    this.attack = attack;
    this.state = "attack";
    this.duration = attack.weapon.attackSpeed;

    this.terminateEffects = {[`attack_${target.id}`]: false};
  }

  start() {
    super.start();

    if (!this.entity) return;

    this.entity.deltaX = this.target.x - this.entity.x;
    this.entity.deltaY = this.target.y - this.entity.y;
    this.entity.accelDir.x = 0;
    this.entity.accelDir.y = 0; 
    this.entity.xVelocity = 0;
    this.entity.yVelocity = 0;

    this.entity.tick = this.entity.world.state.tick;
  }

  checkProceduralPrecondition(): boolean {
    return this.attack.isReady();
  }

  perform(): void {
    if (!this.entity || !this.target) return;

    this.timer++;

    if(this.timer === 5) {
      this.attack.execute();
    }

    if (this.timer === this.duration) {
      this.end();
    }
  }
}
