import mongoose, { Schema } from "mongoose";

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

  gear: {
    frontextra?: string;
    backhair?: string;
    hair?: string;
    hat?: string;
    head?: string;
    top?: string;
    bottom?: string;
    weapon?: string;
    backextra?: string;
  };
}

export const PlayerSchema: Schema = new Schema(
  {
    _id: { type: String },
    username: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    xp: { type: Number, required: true, default: 0 },
    level: { type: Number, required: true, default: 1 },
    race: { type: String, required: true, default: "human" },
    points: { type: Number, required: true, default: 0 },

    STR: { type: Number, required: true, default: 0 },
    DEX: { type: Number, required: true, default: 0 },
    INT: { type: Number, required: true, default: 0 },
    CON: { type: Number, required: true, default: 0 },
    WIS: { type: Number, required: true, default: 0 },
    CHA: { type: Number, required: true, default: 0 },

    gear: {
      frontextra: { type: String, default: "" },
      backhair: { type: String, default: "" },
      hair: { type: String, default: "" },
      hat: { type: String, default: "" },
      head: { type: String, required: true },
      top: { type: String, required: true },
      bottom: { type: String, required: true },
      weapon: { type: String, required: true },
      backextra: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

export const PlayerModel = mongoose.model<IPlayer>("players", PlayerSchema);
