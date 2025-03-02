import { Schema, type } from "@colyseus/schema";
import { Entity } from "../../entities/entity";

export class Feat extends Schema {
  @type("string")
  name: string;

  entity: Entity;

  passive: boolean = false;

  @type("number")
  cooldown: number = 0;

  @type("number")
  cooldownTimeout: number = 0;

  @type("number")
  castingDuration: number = 0;

  @type("boolean")
  isCasting: boolean = false;

  @type("boolean")
  isReady: boolean = false;

  manaCost: number = 0;

  constructor(name: string, entity: Entity) {
    super();
    this.name = name;
    this.entity = entity;
  }

  use() {
    if (!this.isValid()) return;
  }

  update() {
    if (this.isCasting) return;

    if (this.cooldownTimeout === 0) {
      this.isReady = true;
      return;
    }

    this.cooldownTimeout--;
  }

  effect() {}

  execute() {}

  isValid(): boolean {
    return this.isReady;
  }
}
