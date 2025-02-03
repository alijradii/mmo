import mongoose, { Schema } from "mongoose";

export interface IMember {
  _id: string;
  username: string;
  xp: number;
  badges: string[];
}

export const MemberSchema: Schema = new Schema(
  {
    _id: { type: String },
    username: { type: String, required: true },
    xp: { type: Number, required: true },
    badges: [{ type: String, required: true }],
  },
  { _id: false }
);

export const MemberModel = mongoose.model<IMember>("members", MemberSchema);
