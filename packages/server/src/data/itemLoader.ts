import fs from "fs/promises";
import path from "path";

export type WeaponStatBlock = {
  id: string;
  name: string;
  type: "melee" | "ranged" | "magic";
  duration: number;
  cooldown: number;
  damage: number;
  knockback: number;
  stun: number;
  range: number;
  speed: number;
};

const availableWeapons = ["bow1"];
const weaponsDir = path.join(__dirname, "../../public/data/items/weapons");

export class ItemLoader {
  weapons = new Map<string, WeaponStatBlock>();

  async loadWeapons() {
    for (let weaponId of availableWeapons) {
      try {
        const filePath = path.join(weaponsDir, `${weaponId}.json`);
        const data = await fs.readFile(filePath, "utf-8");
        const weapon: WeaponStatBlock = JSON.parse(data);
        this.weapons.set(weaponId, weapon);
      } catch (error) {
        console.log("Error loading weapon: ", weaponId);
        console.log(error);
      }
    }
  }
}

export const itemLoader: ItemLoader = new ItemLoader();