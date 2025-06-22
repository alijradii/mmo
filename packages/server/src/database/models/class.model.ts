import mongoose, { Schema } from "mongoose";
import {
  AbilityScoresList,
  AbilityScoreType,
} from "../../schemas/modules/abilityScores/abilityScores";
import { WeaponGroup } from "./weapon.model";
import { ArmorGroup } from "./armor.model";

export interface IClass {
  _id: string;
  description: string;
  keyAbilities: AbilityScoreType[];
  hitpoints: number;
  speed: number;
  startingWeapon: string;
  weapons: WeaponGroup[];
  armor: ArmorGroup[];
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
  startingWeapon: { type: String, required: true },
  weapons: { type: [String], required: true },
  armor: { type: [String], required: true },
});

export default mongoose.model<IClass>("classes", ClassSchema);
