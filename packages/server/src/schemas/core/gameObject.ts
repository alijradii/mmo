import { Schema, type } from "@colyseus/schema";

export class GameObject extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  z: number = 0;

  constructor() {
    super();
  }
}
