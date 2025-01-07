
import { Schema } from "@colyseus/schema";

export class Player extends Schema {
    id: string;
    x: number;
    y: number;
}
