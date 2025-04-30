import mongoose, { Schema } from "mongoose";
import { AbilityScoresList, AbilityScoreType } from "../../schemas/modules/abilityScores/abilityScores";

export interface IAncestry {
  _id: string;
  description: string;
  abilityBoosts?: AbilityScoreType[][];
  abilityFlaws?: AbilityScoreType[][];
  speed: number;
  hitpoints: number;
  traits: string[];
}

const AncestrySchema: Schema = new Schema<IAncestry>({
  _id: { type: String, required: true },
  description: { type: String, required: true },
  abilityBoosts: {
    type: [[String]],
    enum: [...AbilityScoresList],
    default: [],
  },
  abilityFlaws: {
    type: [[String]],
    enum: [...AbilityScoresList],
    default: [],
  },
  speed: { type: Number, required: true },
  hitpoints: { type: Number, required: true },
  traits: { type: [String], default: [] },
});

export default mongoose.model<IAncestry>("ancestries", AncestrySchema);
