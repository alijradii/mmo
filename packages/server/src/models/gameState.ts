import { Schema, Context, type , MapSchema} from "@colyseus/schema";
import { Player } from "./player";

export class GameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}
