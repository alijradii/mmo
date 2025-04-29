import { Schema, type } from "@colyseus/schema";

export type AbilityScoreType = "STR" | "DEX" | "INT" | "WIS" | "CHA" | "CON"

export const AbilityScoresList: AbilityScoreType[] = [
  "STR",
  "DEX",
  "INT",
  "WIS",
  "CHA",
  "CON",
];

export type OptionalAbility = AbilityScoreType[]

export enum Ability {
  STR = "STR",
  DEX = "DEX",
  CON = "CON",
  INT = "INT",
  WIS = "WIS",
  CHA = "CHA",
}

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

  @type("number")
  AC = 0;
  
  @type("number")
  SPEED = 0;
}
