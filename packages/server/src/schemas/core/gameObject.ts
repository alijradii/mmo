import { Vector } from "../structures/vector";
import { Schema, type } from "@colyseus/schema";

export class GameObject extends Schema {
  @type("string")
  id: string = "";

  @type(Vector)
  loc: { x: 0; y: 0; z: 0 };
}
