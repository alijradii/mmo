import { explosionFeature } from "./explosion";
import { WeaponFeatureArgs } from "./interfaces";
import { lightningStormFeature } from "./lightningStorm";
import { smallExplosionFeature } from "./smallExplosion";
import { smokeFeature } from "./smoke";

export const weaponFeatureFactory = (
  name: string
): (({}: WeaponFeatureArgs) => void) => {
  switch (name) {
    case "explosion":
      return explosionFeature;
    case "small_explosion":
      return smallExplosionFeature;
    case "smoke":
      return smokeFeature;
    case "lightning_storm":
      return lightningStormFeature;

    default:
      throw new Error(`weapon feature not found: ${name}`);
  }
};
