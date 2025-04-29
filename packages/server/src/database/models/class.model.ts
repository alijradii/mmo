import mongoose, { Schema } from "mongoose";
import { AbilityScoreType } from "../../schemas/modules/abilityScores/abilityScores";

export interface IClass {
  _id: string;
  description: string;
  keyAbilities: AbilityScoreType[];
  hitpoints: number;
}

const ClassSchema: Schema = new Schema<IClass>({
  _id: {type: String},
  description: {type: String},
});

export default mongoose.model<IClass>("classes", ClassSchema);