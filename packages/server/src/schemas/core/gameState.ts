import { Schema, type , MapSchema} from "@colyseus/schema";
import { Player } from "../player/player";
import { Projectile } from "./projectile";

export class GameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
  
  @type({map: Projectile})
  projectiles = new MapSchema<Projectile>();
  
  @type("number")
  width = 500;
  
  @type("number")
  height = 500;

  @type("number")
  tick = 0;
  
  entityIdCounter : number = 0;
}
