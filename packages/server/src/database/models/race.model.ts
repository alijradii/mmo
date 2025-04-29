import mongoose, { Schema } from "mongoose";
import { AbilityScoresList, AbilityScoreType } from "../../schemas/modules/abilityScores/abilityScores";

export interface IRace {
  _id: string;
  description: string;
  abilityBoosts?: AbilityScoreType[][];
  abilityFlaws?: AbilityScoreType[][];
  speed: number;
  hitpoints: number;
  traits: string[];
}

const RaceSchema: Schema = new Schema<IRace>({
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

export default mongoose.model<IRace>("races", RaceSchema);
