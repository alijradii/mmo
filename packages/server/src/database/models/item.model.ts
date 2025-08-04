import mongoose, { Schema } from "mongoose";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Item {
  _id: string;
  name: string;
  maxItemsPerStack: number;
  description: string;
  sprite: string;
  rarity: Rarity;
  type: "weapon" | "armor" | "consumable" | "material" | "crafting";
  slot?: "" | "helmet" | "chest" | "legs" | "boots" | "weapon";
}

const ItemSchema: Schema = new Schema<Item>({
  _id: { type: String },
  name: { type: String, required: true },
  maxItemsPerStack: { type: Number, required: true },
  description: { type: String, required: true },
  sprite: { type: String, required: true },
  rarity: {
    type: String,
    enum: ["common", "uncommon", "rare", "epic", "legendary"],
    required: true,
  },
  type: {
    type: String,
    enum: ["weapon", "armor", "consumable", "material", "crafting"],
    required: true,
  },
  slot: {
    type: String,
    enum: ["", "weapon", "helmet", "chest", "legs", "boots", "offhand"],
    required: true,
  },
});

export default mongoose.model<Item>("items", ItemSchema);
