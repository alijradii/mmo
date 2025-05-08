import { Schema, type, MapSchema } from "@colyseus/schema";
import { InventoryItem } from "./inventoryItem";
import {
  InventorySlot,
  IPlayer,
  SLOTS,
} from "../../database/models/player.model";
import { dataStore } from "../../data/dataStore";
import { Player } from "../player/player";

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

  setEquipment(item: InventoryItem) {
    const itemData = dataStore.items.get(item.id);
    if (!itemData) throw new Error(`Item data not found for item:  ${item.id}`);

    if (!itemData.slot) return;

    if (itemData.slot === "weapon") {
    }

    if (itemData.type === "armor") {
    }

    if (itemData.slot === "weapon") {
      this.player.weapon = itemData._id;
    }

    this.equipment.set(itemData.slot, item);
  }

  equipItem(source: number) {
    const row = Math.floor(source / this.cols);
    const col = source % this.cols;

    const item = this.getItem(row, col);

    if (!item) return;
    const itemData = dataStore.items.get(item.id);

    if (!itemData || !itemData.slot) return;

    const oldEquip = this.equipment.get(itemData.slot);

    if (oldEquip) {
      this.setItem(row, col, oldEquip);
    } else this.removeItem(row, col);

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

    this.setItem(row, col, item);

    if (destItem) {
      this.equipment.set(key, destItem);

      if (key === "weapon") {
        this.player.weapon = destItem.id;
      }
    } else {
      this.equipment.delete(key);
      if (key === "weapon") {
        this.player.weapon = "";
      }
    }

    // @ts-ignore
    this.setDirty("items");

    // @ts-ignore
    this.setDirty("equipment");
  }
}
