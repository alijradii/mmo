import fs from "fs/promises";
import path from "path";

type Weapon = {
  id: string;
  name: string;
  type: "melee" | "ranged" | "magic";
  duration: number;
  cooldown: number;
  damage: number;
  knockback: number;
};

const availableWeapons = ["bow1"];
const weaponsDir = path.join(__dirname, "../../public/data/items/weapons");

export class ItemLoader {
  weapons = new Map<string, Weapon>();

  async loadWeapons() {
    for (let weaponId of availableWeapons) {
      try {
        const filePath = path.join(weaponsDir, `${weaponId}.json`);
        const data = await fs.readFile(filePath, "utf-8");
        const weapon: Weapon = JSON.parse(data);
        this.weapons.set(weaponId, weapon);
      } catch (error) {
        console.log("Error loading weapon: ", weaponId);
        console.log(error);
      }
    }
  }
}

export const itemLoader: ItemLoader = new ItemLoader();