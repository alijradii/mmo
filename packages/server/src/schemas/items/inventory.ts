import { Schema, type, MapSchema } from "@colyseus/schema";
import { InventoryItem } from "./inventoryItem";
import {
  InventorySlot,
  IPlayer,
  SLOTS,
} from "../../database/models/player.model";
import { dataStore } from "../../data/dataStore";
import { Player } from "../player/player";
import { WeaponGroup } from "../../database/models/weapon.model";
import { ArmorGroup } from "../../database/models/armor.model";

export class Inventory extends Schema {
  @type({ map: InventoryItem }) items = new MapSchema<InventoryItem>();
  @type({ map: InventoryItem }) equipment = new MapSchema<InventoryItem>();

  @type("number") cols: number = 6;
  @type("number") rows: number = 6;

  player: Player;

  constructor(player: Player) {
    super();
    this.player = player;
  }

  getKey(row: number, col: number): string {
    return `${row * this.cols + col}`;
  }

  getItem(row: number, col: number): InventoryItem | undefined {
    return this.items.get(this.getKey(row, col));
  }

  setItem(row: number, col: number, item: InventoryItem) {
    this.items.set(this.getKey(row, col), item);
  }

  removeItem(row: number, col: number) {
    this.items.delete(this.getKey(row, col));
  }

  moveItem(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    const fromItem = this.getItem(fromRow, fromCol);
    const toItem = this.getItem(toRow, toCol);

    if (!fromItem) {
      console.log("from item not found");
      return;
    }

    this.setItem(toRow, toCol, fromItem);
    if (toItem) {
      this.setItem(fromRow, fromCol, toItem);
    } else {
      this.removeItem(fromRow, fromCol);
    }

    // @ts-ignore
    this.setDirty("items");
  }

  getDatabaseList(): InventorySlot[] {
    const list: InventorySlot[] = Array(36).fill(null);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const item = this.getItem(r, c);

        if (item) {
          list[r * this.cols + c] = {
            itemId: item.id,
            quantity: item.quantity,
          };
        } else list[r * this.cols + c] = { itemId: null, quantity: 0 };
      }
    }

    return list;
  }

  getDatabaseEquipment(): IPlayer["gear"] {
    const gear: IPlayer["gear"] = {
      weapon: null,
      offhand: null,
      helmet: null,
      chest: null,
      legs: null,
      boots: null,
    };

    SLOTS.forEach((slot) => {
      const item = this.equipment.get(slot);

      if (item) {
        gear[slot] = { itemId: item.id, quantity: 1 };
      }
    });
    return gear;
  }

  setEquipment(item: InventoryItem): boolean {
    const itemData = dataStore.items.get(item.id);
    const classData = this.player.iclass;
    if (!classData) return false;

    if (!itemData) throw new Error(`Item data not found for item:  ${item.id}`);

    if (!itemData.slot) return false;

    if (itemData.slot === "weapon") {
      const weaponData = dataStore.weapons.get(itemData._id);

      if (!classData.weapons.includes((weaponData?.group || "") as WeaponGroup))
        return false;

      this.player.appearance.set("weapon", itemData._id);

      this.player.initAttack();
    }

    if (itemData.type === "armor") {
      const armorData = dataStore.armors.get(itemData._id);

      if (!classData.armor.includes((armorData?.group || "") as ArmorGroup))
        return false;
    }

    this.equipment.set(itemData.slot, item);

    this.player.setDirty("appearance");

    console.log("changed weapon to: ", this.player.appearance.get("weapon"));
    return true;
  }

  equipItem(source: number) {
    const row = Math.floor(source / this.cols);
    const col = source % this.cols;

    const item = this.getItem(row, col);

    if (!item) return;
    const itemData = dataStore.items.get(item.id);

    if (!itemData || !itemData.slot) return;

    const oldEquip = this.equipment.get(itemData.slot);

    if (!this.setEquipment(item)) return;

    if (oldEquip) {
      this.setItem(row, col, oldEquip);
    } else this.removeItem(row, col);

    this.player.setDirty("appearance");

    // @ts-ignore
    this.setDirty("items");

    // @ts-ignore
    this.setDirty("equipment");
  }

  unequipItem(key: string, destination: number) {
    const row = Math.floor(destination / this.cols);
    const col = destination % this.cols;

    const item = this.equipment.get(key);
    const destItem = this.getItem(row, col);

    if (!item) return;

    if (destItem) {
      const itemData = dataStore.items.get(destItem.id);

      if (itemData?.slot !== key) {
        return;
      }
    }

    if (destItem) {
      if (!this.setEquipment(destItem)) return;
    } else {
      this.equipment.delete(key);
      if (key === "weapon") {
        this.player.appearance.set("weapon", "");
        this.player.initAttack();
      }
    }

    this.setItem(row, col, item);

    this.player.setDirty("appearance");

    // @ts-ignore
    this.setDirty("items");

    // @ts-ignore
    this.setDirty("equipment");
  }
}
