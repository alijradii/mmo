import mongoose, { Schema } from "mongoose";
import { AbilityScoresList, AbilityScoreType } from "../../schemas/modules/abilityScores/abilityScores";

export interface IClass {
  _id: string;
  description: string;
  keyAbilities: AbilityScoreType[];
  hitpoints: number;
}

const ClassSchema: Schema<IClass> = new Schema<IClass>({
  _id: { type: String, required: true },
  description: { type: String, required: true },
  keyAbilities: {
    type: [String],
    enum: [...AbilityScoresList],
    required: true,
  },
  hitpoints: { type: Number, required: true },
});

export default mongoose.model<IClass>("classes", ClassSchema);
