import { Schema, type } from "@colyseus/schema";

export class Bonuses extends Schema {
    @type("number")
    meleeDamage: number = 0;

    @type("number")
    rangedDamage: number = 0;
}