import { Schema, type , MapSchema} from "@colyseus/schema";
import { Player } from "../player/player";

export class GameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
  
  @type("number")
  width = 500;
  
  @type("number")
  height = 500;

  @type("number")
  tick = 0;
}
