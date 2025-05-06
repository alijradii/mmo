import { fetchItems } from "@/utils/fetchItems";
import { Item } from "@backend/database/models/item.model";

export class DataStore {
  public items = new Map<string, Item>();

  async loadItems() {
    const itemsList: Item[] = await fetchItems();

    itemsList.forEach((item) => {
      this.items.set(item._id, item);
    });
  }


  async init() {
    await this.loadItems();
  }
}

export const dataStore: DataStore = new DataStore();
