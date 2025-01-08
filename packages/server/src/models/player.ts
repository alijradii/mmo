import { MapSchema, Schema, type } from "@colyseus/schema";
import { PlayerInput } from "./gameState";

export class Player extends Schema {
    @type("string")
    id: string = "";

    @type("number")
    x: number = 0;

    @type("number")
    y: number = 0;
    
    @type("number")
    tick: number = 0;
    
    inputQueue: PlayerInput[] = [];
}
