import mongoose, { Schema } from "mongoose";
import { DamageType } from "./weapon.model";
import { Rarity } from "./item.model";

export type ArmorGroup = "light" | "medium" | "heavy";

export type ArmorSlot = "helmet" | "chest" | "legs" | "boots";

export interface ArmorResistance {
  type: DamageType;
  value: number;
}

const ArmorResistanceSchema = new Schema<ArmorResistance>({
  type: { type: String, required: true },
  value: { type: Number, required: true },
});

export interface IArmor {
  _id: string;
  name: string;
  description: string;
  rarity: Rarity;

  slot: ArmorSlot;
  group: ArmorGroup;

  requiredLevel: number;

  armorBonus: number;

  resistances: ArmorResistance[];
  traits: string[];
}

const ArmorSchema = new Schema<IArmor>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },

    slot: {
      type: String,
      enum: ["helmet", "chest", "legs", "boots"],
      required: true,
    },
    group: {
      type: String,
      enum: ["light", "medium", "heavy", "shield"],
      required: true,
    },

    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "epic", "legendary"],
      required: true,
    },

    requiredLevel: { type: Number, required: true },
    armorBonus: { type: Number, required: true },

    resistances: { type: [ArmorResistanceSchema], required: true },
    traits: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IArmor>("armors", ArmorSchema);
