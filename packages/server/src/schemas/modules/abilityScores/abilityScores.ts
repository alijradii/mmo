import { Schema, type } from "@colyseus/schema";


export const scoresList: ("STR" | "DEX" | "INT" | "WIS" | "CHA" | "CON")[] = [
  "STR",
  "DEX",
  "INT",
  "WIS",
  "CHA",
  "CON",
];

export class AbilityScores extends Schema {
    @type("number")
    STR = 0;

    @type("number")
    DEX = 0;
    
    @type("number")
    INT = 0;

    @type("number")
    WIS = 0;

    @type("number")
    CHA = 0;

    @type("number")
    CON = 0;
    
    @type("number")
    HP = 0;
    
    @type("number")
    MP = 0;
}