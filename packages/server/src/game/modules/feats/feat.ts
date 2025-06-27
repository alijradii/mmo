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
  cooldownEndTime: number = 0;

  @type("number")
  castingDuration: number = 0;

  @type("boolean")
  isCasting: boolean = false;

  @type("boolean")
  isReady: boolean = true;

  manaCost: number = 0;

  @type("string")
  category: string = "offensive";

  ranged: boolean = true;

  constructor(name: string, entity: Entity) {
    super();
    this.name = name;
    this.entity = entity;
  }

  use() {
    if (!this.isValid()) return;

    this.effect();

    if (this.cooldown > 0) {
      this.cooldownEndTime = Date.now() + this.cooldown * 1000;
      this.isReady = false;
    }
  }

  update() {
    if (this.isCasting || this.isReady) return;

    if (Date.now() >= this.cooldownEndTime) {
      this.isReady = true;
    }
  }

  effect() {}

  execute() {}

  isValid(): boolean {
    return this.isReady;
  }
}
