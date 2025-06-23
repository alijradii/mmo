import { Schema, type } from "@colyseus/schema";
import { Entity } from "../../entities/entity";

export class StatusEffect extends Schema {
  @type("string")
  name: string;

  @type("number")
  remainingTicks: number;

  effectInterval: number;

  entity!: Entity;

  constructor(name: string, remainingTicks: number, effectInterval = 1) {
    super();

    this.name = name;
    this.remainingTicks = remainingTicks;
    this.effectInterval = effectInterval;
  }

  initialize(entity: Entity) {
    this.entity = entity;
    this.entity.addStatusEffect(this);
    this.onEnter();
  }

  update() {
    if (!this.entity) return;

    if (this.remainingTicks <= 0) {
      this.entity.removeStatusEffect(this.name);
      return;
    }

    this.effect();
    this.remainingTicks--;
  }

  onExit() {}

  onEnter() {}

  effect() {}
}
