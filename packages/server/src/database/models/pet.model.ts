export interface IPet {
  _id: string;
  x: number;
  y: number;
  ownerId: string;
  potentialOwnerId: string;
}

import mongoose, { Schema } from "mongoose";

export interface IPet {
  _id: string;
  x: number;
  y: number;
  ownerId: string;
  potentialOwnerId: string;
}

const PetSchema = new Schema<IPet>({
  _id: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  ownerId: { type: String, required: true },
  potentialOwnerId: { type: String, required: true },
});

export default mongoose.model<IPet>("pets", PetSchema);
