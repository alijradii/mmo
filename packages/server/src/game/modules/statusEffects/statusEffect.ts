import { entity, Schema, type } from "@colyseus/schema";
import { Entity } from "../../entities/entity";

@entity
export class StatusEffect extends Schema {
  @type("string")
  name: string;

  @type("number")
  startTime: number = 0;

  @type("number")
  duration: number;

  effectInterval: number;
  amount: number = 0;

  private lastEffectTime: number = 0;

  entity!: Entity;

  public priority: number = 0;

  constructor(name: string, duration: number, effectIntervalMs: number = 1000) {
    super();

    this.name = name;
    this.duration = duration;
    this.effectInterval = effectIntervalMs;
  }

  initialize(entity: Entity) {
    this.entity = entity;
    this.startTime = Date.now();
    this.lastEffectTime = this.startTime;
    this.entity.addStatusEffect(this);
    this.onEnter();
  }

  update() {
    if (!this.entity) return;

    const now = Date.now();
    const elapsed = now - this.startTime;

    if (elapsed >= this.duration) {
      this.entity.removeStatusEffect(this.name);
      this.onExit();
      return;
    }

    if (now - this.lastEffectTime >= this.effectInterval) {
      this.effect();
      this.lastEffectTime = now;
    }
  }

  onExit() {}

  onEnter() {}

  effect() {}

  applyCondition() {}
}
