import { Schema, Context, type , MapSchema} from "@colyseus/schema";
import { Player } from "./player";

export class GameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
  
  @type("number")
  width = 500;
  
  @type("number")
  height = 500;
}

export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  tick: number;
}