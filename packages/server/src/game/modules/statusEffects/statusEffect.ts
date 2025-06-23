import { Schema, type } from "@colyseus/schema";
import { Entity } from "../../entities/entity";

export class StatusEffect extends Schema {
  @type("string")
  name: string;

  @type("number")
  remainingTicks: number;

  entity!: Entity;

  constructor(name: string, remainingTicks: number) {
    super();

    this.name = name;
    this.remainingTicks = remainingTicks;
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
    }

    this.remainingTicks--;
  }

  onExit() {}

  onEnter() {}

  effect() {}
}
