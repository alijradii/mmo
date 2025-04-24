import { Schema, type } from "@colyseus/schema";

export class InventoryItem extends Schema {
  @type("string")
  id: string;

  @type("number")
  quantity: number;

  constructor(id: string, quantity: number = 0) {
    super();

    this.id = id;
    this.quantity = quantity;
  }
}
