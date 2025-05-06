import { Schema, type, MapSchema } from "@colyseus/schema";
import { InventoryItem } from "./inventoryItem";
import { InventorySlot } from "../../database/models/player.model";

export class Inventory extends Schema {
  @type({ map: InventoryItem }) items = new MapSchema<InventoryItem>();
  @type("number") cols: number = 6;
  @type("number") rows: number = 6;

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
    this.setDirty("items")
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
}
