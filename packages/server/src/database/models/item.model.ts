import mongoose, { Schema, Document } from "mongoose";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Item extends Document {
  name: string;
  maxItemsPerStack: number;
  description: string;
  rarity: Rarity;
  type: "weapon" | "armor" | "consumable" | "material" | "crafting";
}

const ItemSchema: Schema = new Schema<Item>({
  name: { type: String, required: true },
  maxItemsPerStack: { type: Number, required: true },
  description: { type: String, required: true },
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
});

export default mongoose.model<Item>("item", ItemSchema);