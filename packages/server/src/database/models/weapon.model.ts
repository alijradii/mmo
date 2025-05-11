import { Schema, model } from "mongoose";

export type WeaponGroup = "sword" | "axe" | "wand" | "spear" | "bow";

export type DamageType =
  // physical
  | "slashing"
  | "piercing"
  | "bludgeoning"

  // mental
  | "mental"

  // energy
  | "acid"
  | "cold"
  | "fire"
  | "electric"
  | "sonic"
  | "force"

  // other
  | "poison"
  | "bleed"
  | "precision";

export interface DamageBonus {
  type: DamageType;
  value: number;
}

export interface IWeapon {
  _id: string;
  name: string;
  ranged?: boolean;
  description: string;
  group: WeaponGroup;
  traits: string[];

  damage: number;
  damageType: DamageType;

  damageBonuses: DamageBonus[];

  requiredLevel: number;

  attackSpeed: number;
  attackForce: number;
}

const DamageBonusSchema = new Schema<DamageBonus>({
  type: { type: String, required: true },
  value: { type: Number, required: true },
});

const WeaponSchema: Schema<IWeapon> = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    ranged: { type: Boolean, default: false },
    description: { type: String, required: true },
    group: {
      type: String,
      enum: ["sword", "axe", "wand", "spear", "bow"],
      required: true,
    },
    traits: [{ type: String, required: true }],
    damage: { type: Number, required: true },
    damageType: {
      type: String,
      enum: [
        "slashing",
        "piercing",
        "bludgeoning",
        "mental",
        "acid",
        "cold",
        "fire",
        "electric",
        "sonic",
        "force",
        "poison",
        "bleed",
        "precision",
      ],
      required: true,
    },
    requiredLevel: { type: Number, required: true },
    attackSpeed: { type: Number, required: true },
    attackForce: { type: Number, required: true },
    damageBonuses: { type: [DamageBonusSchema], required: true },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export default model<IWeapon>("Weapon", WeaponSchema);
