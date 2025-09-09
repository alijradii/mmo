import { explosionFeature } from "./explosion";
import { WeaponFeatureArgs } from "./interfaces";

export const weaponFeatureFactory = (
  name: string
): (({}: WeaponFeatureArgs) => void) => {
  switch (name) {
    case "explosion":
      return explosionFeature;

    default:
      throw new Error(`weapon feature not found: ${name}`);
  }
};
