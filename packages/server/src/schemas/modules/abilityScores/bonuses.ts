import { Schema, type } from "@colyseus/schema";

export class Bonuses extends Schema {
    meleeDamage: number = 0;

    @type("number")
    rangedDamage: number = 0;
}