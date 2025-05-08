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

export interface IWeapon {
  id: string;
  name: string;
  ranged?: boolean;
  description: string;
  group: WeaponGroup;
  damageType: DamageType;

  requiredLevel: number;

  attackSpeed: number;
  attackForce: number;
}
