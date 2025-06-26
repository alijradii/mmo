import { IWeapon } from "../../../database/models/weapon.model";
import { Entity } from "../../entities/entity";
import { Action } from "../core/action";

export class AttackAction extends Action {
  public target: Entity;
  public weapon: IWeapon;

  constructor(entity: Entity, target: Entity, weapon: IWeapon) {
    const cost = weapon.attackSpeed;

    const name = weapon.ranged ? "ranged" : "melee";

    const conditions: Record<string, any> = {};
    const effects: Record<string, any> = { state: "attack" };

    effects[`attack_${target.id}`] = true;

    if (!weapon.ranged) {
      conditions[`within_range_${target.id}`] = true;
    } else conditions[`within_bounds_${target.id}`] = true;

    super(`attack_${name}`, cost, conditions, effects, entity);

    this.target = target;
    this.weapon = weapon;
    this.state = "attack";
    this.duration = weapon.attackSpeed;
  }

  start() {
    super.start();

    if (!this.entity) return;

    this.entity.deltaX = this.target.x - this.entity.x;
    this.entity.deltaY = this.target.y - this.entity.y;
  }

  perform(): void {
    if (!this.entity || !this.target) return;

    this.timer++;

    if (this.timer === this.duration) {
      this.end();
    }
  }
}
