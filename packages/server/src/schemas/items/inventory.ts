import { Schema, type, MapSchema } from "@colyseus/schema";
import { InventoryItem } from "./inventoryItem";

export class Inventory extends Schema {
  @type({ map: InventoryItem }) items = new MapSchema<InventoryItem>();
  @type("number") cols: number = 5;
  @type("number") rows: number = 5;

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
  }
}
