import mongoose, { Schema } from "mongoose";
import { AbilityScoreType } from "../../schemas/modules/abilityScores/abilityScores";

export interface IRace {
  _id: string;
  description: string;
  abilityBoosts?: AbilityScoreType[];
  abilityFlaw?: AbilityScoreType[];
  speed: number;
  hitpoints: number;
}

const RaceSchema: Schema = new Schema<IRace>({
  _id: {type: String},
  description: {type: String},
});

export default mongoose.model<IRace>("races", RaceSchema);