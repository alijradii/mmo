import { Vector } from "vecti";
import { Schema, type } from "@colyseus/schema";
import { GameRoom } from "../rooms/gameRoom";
import { Rectangle } from "../utils/hitboxes";

export interface PlayerInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;

  direction: "up" | "down" | "left" | "right";
  attack?: boolean;

  tick: number;
}