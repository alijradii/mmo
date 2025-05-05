import mongoose, { Schema } from "mongoose";
import {
  AbilityScoresList,
  AbilityScoreType,
} from "../../schemas/modules/abilityScores/abilityScores";

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

const InventorySlotSchema = new Schema<InventorySlot>({
  itemId: { type: String, default: null },
  quantity: { type: Number, default: 0, min: 0 },
});

export interface IPlayer {
  _id?: string;
  username: string;
  level: number;
  xp: number;
  class: string;
  race: string;

  points: number;

  STR: number;
  DEX: number;
  INT: number;
  WIS: number;
  CHA: number;
  CON: number;

  primaryAttribute: AbilityScoreType | "";

  coins: number;

  appearance: {
    frontextra: string;
    backhair: string;
    hair: string;
    hat: string;
    head: string;
    top: string;
    bottom: string;
    weapon: string;
    backextra: string;
  };

  inventoryGrid: InventorySlot[];
  x: number;
  y: number;
}

export const PlayerSchema: Schema<IPlayer> = new Schema(
  {
    _id: { type: String },
    username: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    xp: { type: Number, required: true, default: 0 },
    level: { type: Number, required: true, default: 1 },
    race: { type: String, required: true, default: "human" },
    points: { type: Number, required: true, default: 0 },
    coins: { type: Number, required: true, default: 0 },

    x: { type: Number, required: true, default: 25 },
    y: { type: Number, required: true, default: 25 },

    STR: { type: Number, required: true, default: 0 },
    DEX: { type: Number, required: true, default: 0 },
    INT: { type: Number, required: true, default: 0 },
    CON: { type: Number, required: true, default: 0 },
    WIS: { type: Number, required: true, default: 0 },
    CHA: { type: Number, required: true, default: 0 },

    primaryAttribute: {
      type: String,
      enum: [...AbilityScoresList, ""],
      required: true,
    },

    appearance: {
      frontextra: { type: String, required: true, default: "" },
      backhair: { type: String, required: true, default: "" },
      hair: { type: String, required: true, default: "" },
      hat: { type: String, required: true, default: "" },
      head: { type: String, required: true, default: "" },
      top: { type: String, required: true, default: "" },
      bottom: { type: String, required: true, default: "" },
      weapon: { type: String, required: true, default: "" },
      backextra: { type: String, required: true, default: "" },
    },

    inventoryGrid: {
      type: [InventorySlotSchema],
      default: Array(36).fill({ itemId: null, quantity: 0 }),
      validate: (slots: InventorySlot[]) => slots.length <= 99,
    },
  },
  {
    timestamps: true,
  }
);

export const PlayerModel = mongoose.model<IPlayer>("players", PlayerSchema);
