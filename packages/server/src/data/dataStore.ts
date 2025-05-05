import fs from "fs/promises";
import path from "path";

import classModel, { IClass } from "../database/models/class.model";
import itemModel, { Item } from "../database/models/item.model";

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
const mapsDir = path.join(__dirname, "../../public/data/maps");
const weaponsDir = path.join(__dirname, "../../public/data/items/weapons");

export class DataStore {
  public weapons = new Map<string, WeaponStatBlock>();
  public items = new Map<string, Item>();
  public classes = new Map<string, IClass>();

  public heightmap: number[][] = [];

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

  async loadHeightMap() {
    const filePath = path.join(mapsDir, `parkour.json`);
    const data = await fs.readFile(filePath, "utf-8");
    const grid: number[][] = JSON.parse(data);

    this.heightmap = grid;

    console.log("initialized tilemap grid: ", grid.length, grid[0]?.length);
  }

  async loadItems() {
    const itemsList: Item[] = await itemModel.find({});

    itemsList.forEach((item) => {
      this.items.set(item._id, item);
    });
  }

  async loadClasses() {
    const classList: IClass[] = await classModel.find({});
    classList.forEach((cl) => {
      this.classes.set(cl._id, cl);
    });
  }

  async init() {
    await this.loadHeightMap();
    await this.loadWeapons();
    await this.loadItems();
    await this.loadClasses();
  }

  getClassesList(): IClass[] {
    return Array.from(this.classes.values());
  }
}

export const dataStore: DataStore = new DataStore();
