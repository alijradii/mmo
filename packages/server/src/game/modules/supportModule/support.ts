import { Rectangle } from "../../../utils/hitboxes";
import { Entity } from "../../entities/entity";
import { StatusEffect } from "../statusEffects/statusEffect";
import { statusEffectFactory } from "../statusEffects/statusEffectFactory";

export class Support {
  name: string = "";
  entity: Entity;

  lastUsed: number = 0;
  x: number;
  y: number;
  width: number;
  height: number;

  statusEffect?: StatusEffect;

  constructor(
    entity: Entity,
    x: number,
    y: number,
    width: number,
    height: number,
    statusEffect?: StatusEffect
  ) {
    this.entity = entity;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.statusEffect = statusEffect;

    this.effect = this.effect.bind(this);
    this.filter = this.filter.bind(this);
  }

  execute(): void {
    this.lastUsed = this.entity.world.state.tick;

    const callbackRect: Rectangle = {
      x: this.x - Math.floor(this.width / 2),
      y: this.y - Math.floor(this.width / 2),
      width: this.width,
      height: this.height,
    };

    this.entity.world.executeCallbackRect(
      callbackRect,
      this.effect,
      this.filter
    );
  }

  effect(entity: Entity) {
    if (!entity) return;

    if (this.statusEffect) {
      const effect = statusEffectFactory({
        name: this.statusEffect.name,
        duration: this.statusEffect.duration,
        interval: this.statusEffect.effectInterval,
        amount: this.statusEffect.amount,
      });

      effect.initialize(entity);
    }
  }

  filter(entity: Entity) {
    return this.entity.party === entity.party;
  }
}
