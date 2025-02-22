import { Schema, type } from "@colyseus/schema";
import { Entity } from "../../entities/entity";

export class Feat extends Schema {
  @type("string")
  name: string;

  entity: Entity;

  passive: boolean = false;
  castTime: number = 0;

  @type("number")
  cooldown: number = 0;

  @type("number")
  cooldownTimeout: number = 0;

  @type("number")
  duration: number = 0;

  @type("number")
  durationTimeout: number = 0;

  manaCost: number = 0;

  constructor(name: string, entity: Entity) {
    super();
    this.name = name;
    this.entity = entity;
  }

  effect() {}

  execute() {}

  isValid(): boolean {
    return true;
  }
}
