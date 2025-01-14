import {Schema, type } from "@colyseus/schema";

export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  tick: number;
}

export class Player extends Schema {
  @type("string")
  id: string = "";

  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("string")
  direction: string = "up";

  @type("number")
  tick: number = 0;

  public inputQueue: PlayerInput[] = []
}
