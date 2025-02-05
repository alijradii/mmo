import { Entity } from "../../entities/entity";

export class Attack {
  name: string = "";
  attackType: "melee" | "ranged" | "magic" = "melee";
  entity: Entity;

  damage: number = 0;
  knockback: number = 0;
  cooldown: number = 0;
  lastUsed: number = 0;

  constructor(entity: Entity) {
    this.entity = entity;

    this.effect = this.effect.bind(this);
    this.filter = this.filter.bind(this);
  }

  isReady(tick: number): boolean {
    return tick > this.lastUsed + this.cooldown;
  }

  execute(tick: number): void {
    this.lastUsed = tick;
  }

  effect(entity: Entity) {
    if (!entity) return;
  }

  filter(entity: Entity) {
    return entity !== this.entity;
  }
}
